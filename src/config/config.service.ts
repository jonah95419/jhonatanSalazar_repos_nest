import * as fs from 'fs';
import { parse } from 'dotenv';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = parse(fs.readFileSync(`${__dirname}/../../.env`));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
