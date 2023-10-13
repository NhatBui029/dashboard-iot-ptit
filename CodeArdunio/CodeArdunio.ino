#include "DHT.h"
#include <ESP8266WiFi.h>
#include <Ticker.h>
#include <AsyncMqttClient.h>
#include <Arduino_JSON.h>

#define WIFI_SSID "aa"
#define WIFI_PASSWORD "12345678"
#define MQTT_HOST IPAddress(192, 168, 111, 247)
#define MQTT_PORT 1883
#define TOPIC "data"

#define DHTPIN 14
#define DHTTYPE DHT11
#define LED 5
#define FAN 4
#define ADDLED 0

bool ledState = false;
bool previousLedState = false;

bool addLedState = false;
bool addPreviousLedState = false;

bool fanState = false;
bool previousFanState = false;

JSONVar doc;

unsigned long previousMillis = 0;  // Stores last time temperature was published
const long interval = 10000;

DHT dht(DHTPIN, DHTTYPE);


AsyncMqttClient mqttClient;
Ticker mqttReconnectTimer;

WiFiEventHandler wifiConnectHandler;
WiFiEventHandler wifiDisconnectHandler;
Ticker wifiReconnectTimer;


void connectToWifi() {
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print("wifi failed");
  }
}

void onWifiConnect(const WiFiEventStationModeGotIP& event) {
  Serial.println("Connected to Wi-Fi.");
  connectToMqtt();
}

void onWifiDisconnect(const WiFiEventStationModeDisconnected& event) {
  Serial.println("Disconnected from Wi-Fi.");
  mqttReconnectTimer.detach();  // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
  wifiReconnectTimer.once(2, connectToWifi);
}

void connectToMqtt() {
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
  if (!mqttClient.connected()) {
    Serial.println("mqtt failed");
  }
}

void onMqttConnect(bool sessionPresent) {
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);
  mqttClient.subscribe("led", 0);
  mqttClient.subscribe("addLed", 0);
  mqttClient.subscribe("fan", 0);
}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
  Serial.println("Disconnected from MQTT.");

  if (WiFi.isConnected()) {
    mqttReconnectTimer.once(2, connectToMqtt);
  }
}

// void onMqttSubscribe(uint16_t packetId, uint8_t qos) {
//   Serial.println("Subscribe acknowledged.");
//   Serial.print("  packetId: ");
//   Serial.println(packetId);
//   Serial.print("  qos: ");
//   Serial.println(qos);
// }

// void onMqttUnsubscribe(uint16_t packetId) {
//   Serial.println("Unsubscribe acknowledged.");
//   Serial.print("  packetId: ");
//   Serial.println(packetId);
// }

void onMqttPublish(uint16_t packetId) {
  Serial.print("Publish acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}


void onMqttMessage(char* topic, char* payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total) {
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");
  String message = "";
  for (int i = 0; i < len; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  if (strcmp(topic, "fan") == 0) {
    if (message == "on") {
      digitalWrite(FAN, HIGH);  // Bật đèn
      fanState = true;
    } else if (message == "off") {
      digitalWrite(FAN, LOW);  // Tắt đèn
      fanState = false;
    }
    Serial.println("LED State: " + String(fanState ? "ON" : "OFF"));
  }


  if (strcmp(topic, "led") == 0) {
    if (message == "on") {
      digitalWrite(LED, HIGH);  // Bật đèn
      ledState = true;
    } else if (message == "off") {
      digitalWrite(LED, LOW);  // Tắt đèn
      ledState = false;
    }
    Serial.println("LED State: " + String(ledState ? "ON" : "OFF"));
  }

  if (strcmp(topic, "addLed") == 0) {
    if (message == "on") {
      digitalWrite(ADDLED, HIGH);  // Bật đèn
      addLedState = true;
    } else if (message == "off") {
      digitalWrite(ADDLED, LOW);  // Tắt đèn
      addLedState = false;
    }
    Serial.println("ADDLED State: " + String(addLedState ? "ON" : "OFF"));
  }
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);

  pinMode(ADDLED, OUTPUT);
  digitalWrite(ADDLED, LOW);

  pinMode(FAN, OUTPUT);
  digitalWrite(FAN, LOW);

  wifiConnectHandler = WiFi.onStationModeGotIP(onWifiConnect);
  wifiDisconnectHandler = WiFi.onStationModeDisconnected(onWifiDisconnect);

  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  //mqttClient.onSubscribe(onMqttSubscribe);
  //mqttClient.onUnsubscribe(onMqttUnsubscribe);
  mqttClient.onPublish(onMqttPublish);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  connectToWifi();
  //mqttClient.subscribe("led");
}


void loop() {
  if (ledState != previousLedState) {
    previousLedState = ledState;
    String ledMessage = (ledState ? "on" : "off");
    uint16_t packetIdPub = mqttClient.publish("ledok", 1, true, ledMessage.c_str());
    Serial.println("Published LED State: " + ledMessage);
    Serial.println(packetIdPub);
  }

  if (fanState != previousFanState) {
    previousFanState = fanState;
    String fanMessage = (fanState ? "on" : "off");
    uint16_t packetIdPub = mqttClient.publish("fanok", 1, true, fanMessage.c_str());
    Serial.println("Published FAN State: " + fanMessage);
    Serial.println(packetIdPub);
  }

  if (addLedState != addPreviousLedState) {
    addPreviousLedState = addLedState;
    String addLedMessage = (addLedState ? "on" : "off");
    uint16_t packetIdPub = mqttClient.publish("addledok", 1, true, addLedMessage.c_str());
    Serial.println("Published LED State: " + addLedMessage);
    Serial.println(packetIdPub);
  }


  int hum = dht.readHumidity();
  int temp = dht.readTemperature();
  int light = analogRead(A0);
  int gas = random(10);


  if(light< 1000){
    String canhbao = "on";
    digitalWrite(FAN, HIGH); 
    digitalWrite(LED, HIGH);
    digitalWrite(ADDLED, HIGH);
    uint16_t packetIdPub = mqttClient.publish("canhbao", 1, true, canhbao.c_str());
  }
  else {
    String canhbao = "off";
    digitalWrite(FAN, LOW); 
    digitalWrite(LED, LOW);
    digitalWrite(ADDLED, LOW);
    uint16_t packetIdPub = mqttClient.publish("canhbao", 1, true, canhbao.c_str());
  }

  if (isnan(hum) || isnan(temp) || isnan(light)) {
    Serial.println("Read data failed !!");
  } else {
    doc["temp"] = temp;
    doc["hum"] = hum;
    doc["light"] = light;
    doc["gas"] = gas;

    String jsonString = JSON.stringify(doc);
    uint16_t packetIdPub = mqttClient.publish(TOPIC, 1, true, jsonString.c_str());

    Serial.println(packetIdPub);
    Serial.println(jsonString);

    delay(3000);
  }
}