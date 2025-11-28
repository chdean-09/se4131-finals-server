#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ESP32Servo.h>

/////////////////////////////////////
////// USER DEFINED VARIABLES //////
/////////////////////////////////////

/// WiFi Settings ///
const char* ssid = "qwertypasd";      // Replace with your WiFi name
const char* password = "2444666668888888"; // Replace with your WiFi password

/// Pin Settings ///
#define SERVO_PIN 18      // Servo motor pin
#define BUZZER_PIN 23     // Passive buzzer pin (changed from 19 to avoid PWM conflicts)

/// Servo Configuration ///
#define SERVO_CLOSED 0    // Closed position (degrees)
#define SERVO_OPEN 90     // Open position (degrees)
#define DISPENSE_DURATION 3000  // How long to keep servo open (ms)

/// Buzzer Melody Notes (frequencies in Hz) ///
#define NOTE_C5  523
#define NOTE_D5  587
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_G5  784
#define NOTE_C6  1047

/// Melody for feeding time ///
int feedingMelody[] = {NOTE_C5, NOTE_E5, NOTE_G5, NOTE_C6};
int feedingDurations[] = {200, 200, 200, 400};

/////////////////////////////////////
////// GLOBAL OBJECTS //////////////
/////////////////////////////////////

WebServer server(80);  // HTTP server on port 80
Servo dispenserServo;

/////////////////////////////////////
//////// HTTP HANDLERS /////////////
/////////////////////////////////////

void handleRoot() {
  String html = "<html><body>";
  html += "<h1>ESP32 Pet Feeder</h1>";
  html += "<p>Status: Online</p>";
  html += "<p>IP Address: " + WiFi.localIP().toString() + "</p>";
  html += "<button onclick=\"fetch('/dispense', {method: 'POST'})\">Dispense Food</button>";
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

void handleDispense() {
  // Enable CORS for cross-origin requests
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (server.method() == HTTP_OPTIONS) {
    server.send(204); // Respond to preflight request
    return;
  }
  
  Serial.println("🍖 Dispense request received!");
  
  // Dispense food
  dispenseFood();
  
  // Send JSON response
  server.send(200, "application/json", "{\"status\":\"success\",\"message\":\"Food dispensed!\"}");
}

void handleNotFound() {
  server.send(404, "text/plain", "404: Not Found");
}

/////////////////////////////////////
//////// DISPENSE FUNCTIONS ////////
/////////////////////////////////////

void dispenseFood() {
  Serial.println("\n=== DISPENSING FOOD ===");
  
  // Play feeding melody
  playFeedingMelody();
  
  // Re-attach servo after tone (tone() can interfere with PWM)
  dispenserServo.attach(SERVO_PIN, 500, 2400);
  delay(50); // Small delay to ensure attachment
  
  // Open servo to dispense food
  Serial.println("Opening dispenser...");
  Serial.print("Moving servo to: ");
  Serial.println(SERVO_OPEN);
  dispenserServo.write(SERVO_OPEN);
  
  // Keep open for specified duration
  delay(DISPENSE_DURATION);
  
  // Close servo
  Serial.println("Closing dispenser...");
  Serial.print("Moving servo to: ");
  Serial.println(SERVO_CLOSED);
  dispenserServo.write(SERVO_CLOSED);
  
  delay(500); // Wait for servo to finish closing
  
  // Play completion tone
  playCompletionTone();
  
  // Re-attach servo again after tone
  dispenserServo.attach(SERVO_PIN, 500, 2400);
  
  Serial.println("=== DISPENSE COMPLETE ===\n");
}

/////////////////////////////////////
//////// BUZZER FUNCTIONS //////////
/////////////////////////////////////

void playFeedingMelody() {
  Serial.println("♪ Playing feeding melody...");
  
  for (int i = 0; i < 4; i++) {
    tone(BUZZER_PIN, feedingMelody[i], feedingDurations[i]);
    delay(feedingDurations[i] + 50);
    noTone(BUZZER_PIN);
  }
}

void playStartupMelody() {
  Serial.println("♪ Playing startup melody...");
  
  int startupMelody[] = {NOTE_C5, NOTE_E5, NOTE_G5};
  for (int i = 0; i < 3; i++) {
    tone(BUZZER_PIN, startupMelody[i], 150);
    delay(200);
    noTone(BUZZER_PIN);
  }
}

void playCompletionTone() {
  tone(BUZZER_PIN, NOTE_G5, 100);
  delay(150);
  noTone(BUZZER_PIN);
  delay(50);
  tone(BUZZER_PIN, NOTE_G5, 100);
  delay(150);
  noTone(BUZZER_PIN);
}

/////////////////////////////////////
////////// SETUP & LOOP ////////////
/////////////////////////////////////

void setup() {
  Serial.begin(115200);
  Serial.println("\n=== Pet Feeder Starting ===");
  
  // Initialize buzzer first
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println("✓ Buzzer initialized");
  
  // Initialize servo with proper configuration
  // Allow allocation of all timers
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  
  dispenserServo.setPeriodHertz(50);    // Standard 50 Hz servo
  dispenserServo.attach(SERVO_PIN, 500, 2400); // Min/Max pulse width in microseconds
  
  // Test servo movement
  Serial.println("Testing servo...");
  dispenserServo.write(SERVO_CLOSED);
  delay(500);
  Serial.println("✓ Servo initialized (closed position)");
  
  // Quick test movement
  Serial.println("Testing servo range...");
  dispenserServo.write(45);
  delay(1000);
  dispenserServo.write(SERVO_CLOSED);
  delay(500);
  Serial.println("✓ Servo test complete");
  
  // Connect to WiFi
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  Serial.println("✓ WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("⚠️  SAVE THIS IP ADDRESS FOR YOUR FRONTEND!");
  
  // Setup HTTP server routes
  server.on("/", HTTP_GET, handleRoot);
  server.on("/dispense", HTTP_POST, handleDispense);
  server.on("/dispense", HTTP_OPTIONS, handleDispense); // CORS preflight
  server.onNotFound(handleNotFound);
  
  // Start HTTP server
  server.begin();
  Serial.println("✓ HTTP server started on port 80");
  Serial.println("=== Setup Complete ===\n");
  
  // Play startup melody
  playStartupMelody();
}

void loop() {
  server.handleClient();
}