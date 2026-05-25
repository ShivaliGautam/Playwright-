export interface EnvironmentConfig {
  baseUrl: string;
  apiBaseUrl: string;
  defaultTimeout: number;
  headless: boolean;
}

const config: EnvironmentConfig = {
 baseUrl:    'https://www.automationexercise.com',  // ← change UI URL here
apiBaseUrl: 'https://www.automationexercise.com/api', // ← change API URL here
headless:   true ,  // ← false = see the browser while tests run
  defaultTimeout: Number(process.env['DEFAULT_TIMEOUT'] ?? 30000),
};

export default config;

