import { storeTenantData } from "./aws/remote-storage";
//@ts-ignore
import ForgeUI, {
  useProductContext,
  render,
  Fragment,
  Button,
  IssuePanel,
  JiraContext,
} from "@forge/ui";
import api, { route } from "@forge/api";

function isString(x: any): x is string {
  return typeof x === "string";
}

async function issueSummary(issueKey: string) {
  console.log(`Getting content for issue ${issueKey} ...`);
  const response = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueKey}`, {
      headers: {
        Accept: "application/json",
      },
    });
  console.log(`Jira response: ${response.status} ${response.statusText}`);
  const body = await response.json();
  return body.summary;
}

const App = () => {
  const context = useProductContext();
  // console.log(`Product context: ${JSON.stringify(context)}`);
  const jiraContext = context.platformContext as JiraContext;
  const isMissingContext =
    typeof context.platformContext === "undefined" ||
    typeof context.cloudId === "undefined" ||
    typeof jiraContext.issueKey === "undefined";
  console.log(`Context cloudId: ${context.cloudId}`);
  console.log(`Jira context issueId: ${jiraContext.issueKey}`);

  return (
    <Fragment>
      <Button
        text="Send to AWS"
        disabled={isMissingContext}
        onClick={async () => {
          if (isString(context.cloudId) && isString(jiraContext.issueKey)) {
            const content = await issueSummary(jiraContext.issueKey);
            await storeTenantData(context.cloudId, content);
          }
        }}
      />
    </Fragment>
  );
};

export const panel = render(
  <IssuePanel>
    <App />
  </IssuePanel>,
);
