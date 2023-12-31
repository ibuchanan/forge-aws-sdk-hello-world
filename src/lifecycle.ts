export async function lifecycle(event: any, context: any) {
  /*
  Lifecycle events look like:
  {
      "id": "fff8e466-31f4-4c73-a337-c3309dd930dc",
      "installerAccountId": "4ad9aa0c52dc1b420a791d12",
      "app": { 
          "id": "406d303d-0393-4ec4-ad7c-1435be94583a", 
          "version": "9.0.0"
      }
  }
  https://developer.atlassian.com/platform/forge/events-reference/life-cycle/
  */
  console.log(`Received app lifecycle event`);
  // console.log(`    event: ${JSON.stringify(event)}`);
  const account = event.installerAccountId || event.upgraderAccountId;
  console.log(`App installed/upgraded`);
  console.log(`    event type: ${event.eventType}`);
  console.log(`    performed by: ${account}`);
  console.log(`    into cloud id: ${event.context.cloudId}`);
  console.log(`    app version: ${event.app.version}`);
  console.log(`    installation id: ${event.id}`);
  // console.log(`Runtime versions ${JSON.stringify(process.versions)}`);
  console.log(`Node.js runtime version ${process.versions.node}`);
}
