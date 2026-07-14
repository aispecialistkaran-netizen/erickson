const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const JSON_FILE_PATH = path.join(__dirname, 'events.json');

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
  console.log("====================================");
  console.log("   Add New Event to events.json");
  console.log("====================================\n");

  const title = await question("Event Title: ");
  const description = await question("Description: ");
  const presenter = await question("Presenter: ");
  const date = await question("Date (YYYY-MM-DD): ");
  const time = await question("Time (e.g., 7:00 PM) [7:00 PM]: ") || "7:00 PM";
  const duration = await question("Duration [1 Hour]: ") || "1 Hour";
  const tagsStr = await question("Tags (comma separated): ");
  const registrationLink = await question("Registration Link (URL): ");
  const image = await question("Image path/URL (e.g., ./name.jpg): ");

  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];

  let events = [];
  if (fs.existsSync(JSON_FILE_PATH)) {
    const raw = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    try {
      events = JSON.parse(raw);
    } catch (e) {
      console.error("Error parsing existing events.json:", e.message);
      process.exit(1);
    }
  }

  // Find max ID
  const maxId = events.reduce((max, e) => (e.id > max ? e.id : max), 0);

  const newEvent = {
    id: maxId + 1,
    title,
    description,
    presenter,
    date,
    time,
    duration,
    type: "Webinar",
    category: "webinar",
    status: "upcoming",
    statusLabel: "Upcoming",
    pricing: {
      type: "free",
      label: "Registration",
      value: "Free"
    },
    tags,
    registrationLink: registrationLink || null,
    virtual: true,
    featured: false,
    free: true,
    image: image || ""
  };

  events.push(newEvent);

  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(events, null, 2), 'utf-8');
  console.log("\n✅ Event added successfully!");
  
  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
});
