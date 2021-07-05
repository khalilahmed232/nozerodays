C: 
cd C:\Users\Khalil Ahmed\Documents\workspace-spring-tool-suite-4-4.9.0.RELEASE\NoMoreZeroDays
call mvn clean package
start java -jar target\NoMoreZeroDays-0.0.1-SNAPSHOT.jar
start live-server ui\nozerodays\ --port=8081