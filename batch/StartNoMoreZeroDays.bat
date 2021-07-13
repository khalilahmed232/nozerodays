E: 
cd E:\code\new\nozerodays
call mvn clean package
start java -jar target\NoMoreZeroDays-0.0.1-SNAPSHOT.jar
start live-server ui\nozerodays\ --port=8081