# AWS-SAM-Typescript-Walkthough
This repository is a walkthough of my process of creating an AWS SAM application using Typescript.

While having made several attempts at following tutorials; playing with different samples / starter examples none of them felt right.
Some I'm sure make more sense; and are better for various reasions, but as a begining they didn't help me understand the process very well.

If I mention an article/tutorial you wrote, please don't take my remarks to heart.

For the remainder of this article I will be using nodejs20.x; I have no idea if it will apply to other versions of node, but don't see why it wouldn't.

**Goals:**

1) A typescript based SAM project
2) Easy builds
3) 

# Where it starts.

It all starts from the [AWS SAM cli](#TODO).

```
$ sam init --runtime nodejs20.x
Which template source would you like to use?
        1 - AWS Quick Start Templates
        2 - Custom Template Location
Choice:
```

Great! We're provided with a choice of [starter templates](https://github.com/aws/aws-sam-cli-app-templates/tree/master/nodejs20.x) or a custom template of our own. Lets start with an AWS provided 

```
Choose an AWS Quick Start application template
        1 - Hello World Example
        2 - GraphQLApi Hello World Example
        3 - Hello World Example with Powertools for AWS Lambda
        4 - Multi-step workflow
        5 - Standalone function
        6 - Scheduled task
        7 - Data processing
        8 - Serverless API
        9 - Full Stack
        10 - Lambda Response Streaming
Template:
```

So far so simple.... Lets keep it simple and use the `Hello World Example`. (1)

```
Based on your selections, the only Package type available is Zip.
We will proceed to selecting the Package type as Zip.

Based on your selections, the only dependency manager available is npm.
We will proceed copying the template using npm.

Select your starter template
        1 - Hello World Example
        2 - Hello World Example TypeScript
Template:
```

Obviously we'll select 2 because... Well, Typescript Right?

```
Would you like to enable X-Ray tracing on the function(s) in your application?  [y/N]:
```

Nope; Keeping it simple.

```
Would you like to enable monitoring using CloudWatch Application Insights?
For more info, please view https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html [y/N]:
```

No... Keeping it simple....

```
Would you like to set Structured Logging in JSON format on your Lambda functions?  [y/N]:
```

No.. Wait! Yes... that'll make debugging simpiler. Right?

```
Project name [sam-app]:
```

Sure..

```

    -----------------------
    Generating application:
    -----------------------
    Name: sam-app
    Runtime: nodejs20.x
    Architectures: x86_64
    Dependency Manager: npm
    Application Template: hello-world-typescript
    Output Directory: .
    Configuration file: sam-app/samconfig.toml

    Next steps can be found in the README file at sam-app/README.md


Commands you can use next
=========================
[*] Create pipeline: cd sam-app && sam pipeline init --bootstrap
[*] Validate SAM template: cd sam-app && sam validate
[*] Test Function in the Cloud: cd sam-app && sam sync --stack-name {stack-name} --watch
```

OK; Now we have our `sam-app` folder and the Hello World Tutorial. Lets `cd sam-app` and test.

## Initial sam-app Testing

Lets ignore the suggested next commands; and see what we are given and if we can get it running.

Opening the `template.yaml` file in [Application Composer](#TODO) we see the following:

![Image](./images/1.png)

Great! A simple `GET /hello` request will call our `HelloWorldFunction`.

Lets try it out locally! (*I'm not running "locally" but a remote server so I need to add a --host flag so I can access the endpoint from my workstation*)

```
$ sam local start-api --host 10.0.0.1
Initializing the lambda functions containers.
Local image is up-to-date
Using local image: public.ecr.aws/lambda/nodejs:20-rapid-x86_64.

Mounting /home/sniper7kills/AWS-SAM-Typescript-Walkthough/sam-app/hello-world as /var/task:ro,delegated, inside runtime container
Containers Initialization is done.
Mounting HelloWorldFunction at http://10.0.0.1:3000/hello [GET]
You can now browse to the above endpoints to invoke your functions. You do not need to restart/reload SAM CLI while working on your functions, changes will be reflected instantly/automatically. If you used sam build before running local commands, you  
will need to re-run sam build for the changes to be picked up. You only need to restart SAM CLI if you update your AWS SAM template
2024-02-12 13:34:24 WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://10.0.0.1:3000
2024-02-12 13:34:24 Press CTRL+C to quit
```

OK; so lets send a request to that endpoint.

```
Invoking app.lambdaHandler (nodejs20.x)
Reuse the created warm container for Lambda function 'HelloWorldFunction'
Lambda function 'HelloWorldFunction' is already running
START RequestId: 232d34e7-b5bb-4b27-95e4-0bac1ea96426 Version: $LATEST
{"timestamp":"2024-02-12T18:36:21.882Z","level":"ERROR","message":{"errorType":"ImportModuleError","errorMessage":"Error: Cannot find module 'app'\nRequire stack:\n- /var/runtime/index.mjs","stackTrace":["Runtime.ImportModuleError: Error: Cannot find module 'app'","Require stack:","- /var/runtime/index.mjs","    at _loadUserApp (file:///var/runtime/index.mjs:1087:17)","    at async UserFunction.js.module.exports.load (file:///var/runtime/index.mjs:1119:21)","    at async start (file:///var/runtime/index.mjs:1282:23)","    at async file:///var/runtime/index.mjs:1288:1"]}}
12 Feb 2024 18:36:21,890 [ERROR] (rapid) Init failed error=Runtime exited with error: exit status 129 InvokeID=
12 Feb 2024 18:36:21,890 [ERROR] (rapid) Invoke failed error=Runtime exited with error: exit status 129 InvokeID=9b4dbadb-120c-49e8-bcb5-da7a2eaf4636
12 Feb 2024 18:36:21,891 [ERROR] (rapid) Invoke DONE failed: Sandbox.Failure

2024-02-12 13:36:22 10.0.0.225 - - [12/Feb/2024 13:36:22] "GET /hello HTTP/1.1" 500 -
```

OK.. We got an 500 response and obviously an error.

If you guessed "thats because you didn't build it" you are correct. So lets do that. `CTRL + C` and build.

```
$ sam build --use-container
Starting Build use cache
Starting Build inside a container
Cache is invalid, running build and copying resources for following functions (HelloWorldFunction)
Building codeuri: /home/sniper7kills/AWS-SAM-Typescript-Walkthough/sam-app/hello-world runtime: nodejs20.x metadata: {'BuildMethod': 'esbuild', 'BuildProperties': {'Minify': True, 'Target': 'es2020', 'Sourcemap': True,        
'EntryPoints': ['app.ts']}} architecture: x86_64 functions: HelloWorldFunction

Fetching public.ecr.aws/sam/build-nodejs20.x:latest-x86_64 Docker container image......
Mounting /home/sniper7kills/AWS-SAM-Typescript-Walkthough/sam-app/hello-world as /tmp/samcli/source:ro,delegated, inside runtime container
 Running NodejsNpmEsbuildBuilder:CopySource
 Running NodejsNpmEsbuildBuilder:NpmInstall
 Running NodejsNpmEsbuildBuilder:EsbuildBundle

Sourcemap set without --enable-source-maps, adding --enable-source-maps to function HelloWorldFunction NODE_OPTIONS

You are using source maps, note that this comes with a performance hit! Set Sourcemap to false and remove NODE_OPTIONS: --enable-source-maps to disable source maps.


Build Succeeded

Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml

Commands you can use next
=========================
[*] Validate SAM template: sam validate
[*] Invoke Function: sam local invoke
[*] Test Function in the Cloud: sam sync --stack-name {{stack-name}} --watch
[*] Deploy: sam deploy --guided
```

Did you catch that `--use-container` flag? I'm using that to ensure my builds are the same regardless of where they are running. (I.E. locally right now; but in GithubActions in the future as well)

With it built; lets try running and connecting again.

```
$ sam local start-api --host 10.0.0.1
Initializing the lambda functions containers.
Local image is up-to-date
Using local image: public.ecr.aws/lambda/nodejs:20-rapid-x86_64.

Mounting /home/sniper7kills/AWS-SAM-Typescript-Walkthough/sam-app/.aws-sam/build/HelloWorldFunction as /var/task:ro,delegated, inside runtime container
Containers Initialization is done.
Mounting HelloWorldFunction at http://10.0.0.1:3000/hello [GET]
You can now browse to the above endpoints to invoke your functions. You do not need to restart/reload SAM CLI while working on your functions, changes will be reflected instantly/automatically. If you used sam build before running local commands, you  
will need to re-run sam build for the changes to be picked up. You only need to restart SAM CLI if you update your AWS SAM template
2024-02-12 13:45:23 WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://10.0.0.1:3000
2024-02-12 13:45:23 Press CTRL+C to quit
Invoking app.lambdaHandler (nodejs20.x)
Reuse the created warm container for Lambda function 'HelloWorldFunction'
Lambda function 'HelloWorldFunction' is already running
START RequestId: 887bfc20-853e-4b6b-9b74-100a7f0469da Version: $LATEST
END RequestId: 8b592d98-1ec4-4e8d-8f67-c6bcdc0382c5
REPORT RequestId: 8b592d98-1ec4-4e8d-8f67-c6bcdc0382c5  Init Duration: 0.04 ms  Duration: 52.13 ms      Billed Duration: 53 ms  Memory Size: 128 MB     Max Memory Used: 128 MB

No Content-Type given. Defaulting to 'application/json'.
2024-02-12 13:45:28 10.0.0.225 - - [12/Feb/2024 13:45:28] "GET /hello HTTP/1.1" 200 -
```

Sweet! we got it running; and we got back the expected "Hello World" message in the response.

**COMMIT 1**

## Adding a New Function

OK; so we now have a TypeScript Lambda function; it shouldn't be hard to create another one.

Lets add a new API endpoint; along with a new Lambda Function. (Again in Application Composer)

![Image 2](./images/2.png)

**COMMIT 2**

OK; so now I get to start with some complaints and issues I have.

I'm only going to briefly touch on them in this document; but I'll link to where I go into more detail.

- [Application Compose generates boiler plate too quickly!](./docs/Issues.md#issue-1)
- [Boiler Plate doesn't match expected code from "hello world"](./docs//Issues.md#issue-2)

OK; Ignoring those two issues; lets built and run it.

```
$ sam build --use-container
Starting Build use cache
Starting Build inside a container
Cache is invalid, running build and copying resources for following functions (Function)
Building codeuri: /srv/samba/sda/RunbookSolutions/appsyncTests/AWS-SAM-Typescript-Walkthough/sam-app/src/Function runtime: nodejs20.x metadata: {'BuildMethod': 'esbuild', 'BuildProperties': {'EntryPoints': ['index.mts'], 'External': ['@aws-sdk/*',     
'aws-sdk'], 'Minify': False}} architecture: x86_64 functions: Function
Valid cache found, copying previously built resources for following functions (HelloWorldFunction)

Fetching public.ecr.aws/sam/build-nodejs20.x:latest-x86_64 Docker container image......
Mounting /srv/samba/sda/RunbookSolutions/appsyncTests/AWS-SAM-Typescript-Walkthough/sam-app/src/Function as /tmp/samcli/source:ro,delegated, inside runtime container

Build Failed
 Running NodejsNpmEsbuildBuilder:CopySource
 Running NodejsNpmEsbuildBuilder:NpmInstall
 Running NodejsNpmEsbuildBuilder:EsbuildBundle
Error: NodejsNpmEsbuildBuilder:EsbuildBundle - Esbuild Failed: Cannot find esbuild. esbuild must be installed on the host machine to use this feature. It is recommended to be installed on the PATH, but can also be included as a project dependency. 
```

Really? I can't even **build** the boiler plate code.

So we need to make some changes:
1) modify `src/Function/package.json`
```diff
 {
   "name": "function",
   "version": "1.0.0",
   "type": "module",
+  "dependencies": {
+    "esbuild": "0.20.0"
+  },
   "devDependencies": {
     "@types/aws-lambda": "~8"
   }
 }
```

While were in here lets also "improve" the default typescript file.
1) modify `src/Function/index.mts`

```diff
- import { Handler } from "aws-lambda";
+ import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';

- export const handler: Handler<object, object> = async event => {
-  // Log the event argument for debugging and for use in local development.
-  console.log(JSON.stringify(event, undefined, 2));
- 
-  return {};
- };
+ export const handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): void => {
+    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
+    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
+    callback(null, {
+        statusCode: 200,
+        body: JSON.stringify({
+            message: 'hello world',
+        }),
+    });
+};
```

And now it build; and when we send a `GET /world` we recieve a 200 response.

Its not hard... But it would be nice for this to be customizable.

**COMMIT 3**