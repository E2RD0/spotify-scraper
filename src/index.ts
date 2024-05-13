import { SpotifyScraper } from "./SpotifyScraper";

async function main(): Promise<void> {
  const scraper = new SpotifyScraper();
  await scraper.getSpotifyData();
}

main();
