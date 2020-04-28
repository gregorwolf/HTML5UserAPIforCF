# HTML5UserAPI for Cloud Foundry

This project provides a simple MTA application which serves links to a Node.js backend that servers some Endpoints showing user information using Express. It can be deployed as an Multi Target Application to the SAP Cloud Platform - Cloud Foundry Environment.

## Deploy to SAP Cloud Platform - Cloud Foundry

### Prerequisite

- You have a [SAP Cloud Platform Trial account](https://hanatrial.ondemand.com/)
- The [Cloud MTA Build Tool (MBT)](https://sap.github.io/cloud-mta-build-tool/) is installed
- The [Cloud Foundry commandline tool](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) is installed
- The [MultiApps CF CLI Plugin](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin) is installed
- You've connected using `cf login`to your trial account
- You've connected a SAP Cloud Connector to your subaccount
- Principal Propagation is setup in the Cloud Connector to the ABAP Backend

### Preperation

Before you can deploy the application to your Cloud Foundry account the destinations to the backend system must be created. Please find here what I've used in my environment:

If you want to test the connection to a ABAP Backend, then the destination SAP_ABAP_BACKEND used by the approuter:

```
URL=http\://npl752.virtual\:44300
Name=SAP_ABAP_BACKEND
ProxyType=OnPremise
Type=HTTP
sap-client=001
Authentication=PrincipalPropagation
```

must be created. If you want to test the connection to the SAP Business One Service Layer, then the destination SAP_B1_BACKEND must be created:

```
URL=http\://b1server.virtual\:44300
Name=SAP_B1_BACKEND
ProxyType=OnPremise
Type=HTTP
Authentication=BasicAuthentication
```

As described in the answer to [B1 Service Layer Login Credentials as Destination Properties](https://answers.sap.com/answers/12688540/view.html) the credentials can be added as shown in this example:

```
username: {"UserName": "manager", "CompanyDB": "SBODEMOUS"}
password: 1234
```
### Build

`npm run build:cf`

### Deploy

`npm run deploy:cf`

