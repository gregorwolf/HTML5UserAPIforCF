# HTML5UserAPI for Cloud Foundry

This project provides a simple MTA application which serves links to a Node.js backend that servers some Endpoints showing user information using Express. It can be deployed as an Multi Target Application to the SAP Cloud Platform - Cloud Foundry Environment.

## Deploy to SAP Cloud Platform - Cloud Foundry

### Prerequisite

If you want to deploy the latest released version:

- You have a [SAP Business Technology Platform Platform Trial](https://hanatrial.ondemand.com/), [Free Tier or productive account](https://cockpit.eu10.hana.ondemand.com/)
- The [Cloud Foundry command line tool](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) is installed
- The [MultiApps CF CLI Plugin](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin) is installed
- You've connected using `cf login`to your BTP subaccount
- You've connected a [SAP Cloud Connector](https://tools.hana.ondemand.com/#cloud) to your subaccount
- [Principal Propagation is setup in the Cloud Connector to the ABAP Backend](https://blogs.sap.com/2017/06/22/how-to-guide-principal-propagation-in-an-https-scenario/)

If you want to build the current state of the repository:

- You have the Node.JS version defined in .nvmrc installed
- The [Cloud MTA Build Tool (MBT)](https://sap.github.io/cloud-mta-build-tool/) is installed

### Preperation

Before you can deploy the application to your Cloud Foundry account the destinations to the backend system must be created. Please find here what I've used in my environment:

If you want to test the connection to a SAP ABAP Backend via HTTP(S), then you have to create the destination SAP_ABAP_BACKEND used by the approuter:

```
URL=http\://npl752.virtual\:44300
Name=SAP_ABAP_BACKEND
ProxyType=OnPremise
Type=HTTP
sap-client=001
Authentication=PrincipalPropagation
```

If you want to test the connection to the SAP ABAP via RFC, then you have to create the destination SAP_ABAP_BACKEND_RFC used by the Java application:

```
Type=RFC
jco.client.ashost=npl752.virtual
jco.destination.repository.user=SAPUSERNAME
Name=SAP_ABAP_BACKEND_RFC
jco.client.user=SAPUSERNAME
jco.client.sysnr=01
jco.destination.proxy_type=OnPremise
jco.client.client=001
```

If you want to test the connection to the SAP Business One Service Layer via HTTP(S), then the destination SAP_B1_BACKEND must be created:

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

### Deploy the release version

- Download the mtar file provided at [releases](https://github.com/gregorwolf/HTML5UserAPIforCF/releases)
- run the command `cf deploy <path and filename of the mtar>`

### Build and Deploy

To build and deploy the project run:

`npm run build:cf`

and then

`npm run deploy:cf`
