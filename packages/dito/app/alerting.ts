const ALERTMANAGER_URL =
  process.env.ALERTMANAGER_URL || "http://localhost:9093/api/v1/alerts";
const ALERTMANAGER_STATUS_URL =
  process.env.ALERTMANAGER_STATUS_URL || "http://localhost:9093/api/v1/status";

interface Alert {
  labels: {
    alertname: string;
    severity: string;
  };
  annotations: {
    summary: string;
    description: string;
  };
  startsAt: string;
  endsAt: string;
}

const checkAlertmanagerStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(ALERTMANAGER_STATUS_URL, {
      method: "GET",
    });
    return response.ok;
  } catch (error) {
    console.error("Error checking Alertmanager status");
    return false;
  }
};

export const sendAlert = async (alert: Alert): Promise<void> => {
  const isAlertmanagerRunning = await checkAlertmanagerStatus();

  if (!isAlertmanagerRunning) {
    console.warn("Alertmanager is not running. Skipping alert.");
    return;
  }

  try {
    const response = await fetch(ALERTMANAGER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([alert]),
    });

    if (!response.ok) {
      throw new Error(`Failed to send alert: ${response.statusText}`);
    }

    console.log("Alert sent successfully");
  } catch (error) {
    console.error("Error sending alert", error);
  }
};
