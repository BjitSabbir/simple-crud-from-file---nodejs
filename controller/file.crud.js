const fs = require("fs").promises;
const path = require("path");

const FILE_NAME = "manga.json";
const dataFilePath = path.join(__dirname, "./../dbs", FILE_NAME);
const FILE_LOG_NAME = "data_log.txt";
const logFilePath = path.join(__dirname, "./../log", FILE_LOG_NAME);

// Async function to read data from the JSON file

async function readLogFile() {
  try {
    const logData = await fs.readFile(logFilePath, "utf8");
    return logData;
  } catch (error) {
    console.error("Error reading log file:", error);
    throw error;
  }
}

async function appendToLogFile(message) {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    await fs.appendFile(logFilePath, logMessage);
    console.log("Message appended to log file.");
  } catch (error) {
    console.error("Error appending to log file:", error);
    throw error;
  }
}

async function readJsonData() {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    throw error;
  }
}

async function writeJsonData(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    appendToLogFile("Data written to JSON file.");
    console.log("Data written to JSON file.");
  } catch (error) {
    console.error("Error writing to JSON file:", error);
    throw error;
  }
}

async function addData(prevData, newData) {
  const newId = prevData.length > 0 ? prevData[prevData.length - 1].id + 1 : 1;
  const updatedNewData = { ...newData, id: newId };

  const newUpdatedJsonData = [...prevData, updatedNewData];

  await writeJsonData(newUpdatedJsonData);
  appendToLogFile("Data had been added");
  return newUpdatedJsonData;
}

async function updateDataById(prevData, idToUpdate, updatedData) {
  const updatedJsonData = prevData.map((item) => {
    if (item.id === idToUpdate) {
      console.log("-->", item.id, idToUpdate);
      console.log("-->", typeof item.id, typeof idToUpdate);

      const newUpdatedID = { ...updatedData, id: idToUpdate };

      return { ...item, ...newUpdatedID };
    }
    else{
        return item;
    }
  
  });
  appendToLogFile("Data by id " + idToUpdate + " had been updated");
  await writeJsonData(updatedJsonData);
  return updatedJsonData;
}

async function deleteDataById(prevData, idToDelete) {
  const updatedJsonData = prevData.filter((item) => item.id !== idToDelete);
  await writeJsonData(updatedJsonData);
  if (JSON.stringify(updatedJsonData) !== JSON.stringify(prevData)) {
    appendToLogFile("Data by id " + idToDelete + "  had been deleted");
  }
  console.log(updatedJsonData);
  return updatedJsonData;
}

module.exports = {
  readJsonData,
  writeJsonData,
  addData,
  updateDataById,
  deleteDataById,
};
