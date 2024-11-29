import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  },
});

export const initializeMonitoring = () => {
  // Initialize Sentry
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });

  // Initialize Application Insights
  appInsights.loadAppInsights();
  appInsights.trackPageView();
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context });
  appInsights.trackException({ error, properties: context });

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, 'Context:', context);
  }
};

export const trackEvent = (
  name: string,
  properties?: Record<string, any>,
  measurements?: Record<string, number>
) => {
  appInsights.trackEvent({ name, properties, measurements });
};

export const trackMetric = (
  name: string,
  value: number,
  properties?: Record<string, any>
) => {
  appInsights.trackMetric({ name, average: value }, properties);
};

export const setUserContext = (userId: string, role: string) => {
  Sentry.setUser({ id: userId, role });
  appInsights.setAuthenticatedUserContext(userId, role);
};

export const clearUserContext = () => {
  Sentry.setUser(null);
  appInsights.clearAuthenticatedUserContext();
};
