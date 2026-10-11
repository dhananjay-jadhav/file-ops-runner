import EventEmitter from "node:events";
import { watch, open, readFile } from "node:fs/promises";

const EventName = "Change";
const commandFilePath = "src/command.txt";

async function fileWatcher(eventEmitter: EventEmitter) {
  const watcher = await watch(commandFilePath);
  for await (const event of watcher) {
    if (event.eventType === "change") {
      eventEmitter.emit(EventName);
    }
  }
}

async function commandFileHandler(eventEmitter: EventEmitter) {
  // Open Command File
  const fileHandler = await open(commandFilePath, "r");

  eventEmitter.on(EventName, async () => {
    const bufferSize = (await fileHandler.stat()).size;

    const buffer = Buffer.alloc(bufferSize);

    const offset = 0;
    const position = 0;

   await fileHandler.read(buffer, offset, bufferSize, position);

    console.log(buffer.toString('utf-8'));
  });
}

async function app() {
  const eventEmitter = new EventEmitter();

  await commandFileHandler(eventEmitter);

  await fileWatcher(eventEmitter);
}

app();
