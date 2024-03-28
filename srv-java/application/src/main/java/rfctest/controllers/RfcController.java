package rfctest.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.sap.cloud.sdk.cloudplatform.connectivity.Destination;
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.s4hana.connectivity.rfc.RfmRequestResult;
import com.sap.cloud.sdk.s4hana.connectivity.rfc.RfmRequest;

import rfctest.models.HelloWorldResponse;

@RestController
@RequestMapping("/rfc")
public class RfcController {
    private static final Logger logger = LoggerFactory.getLogger(RfcController.class);

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<HelloWorldResponse> getHello(
            @RequestParam(name = "name", defaultValue = "USER_NAME_GET") final String name) {
        logger.info("I am running!");
        final String destinationName = "SAP_ABAP_BACKEND_RFC";
        final Destination destination = DestinationAccessor.getDestination(destinationName);
        String response = name;

        try {
            final RfmRequestResult rfmTest = new RfmRequest(name, false) // false is for non-commit
                    .execute(destination);
            response = new Gson().toJson(rfmTest);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return ResponseEntity.ok(new HelloWorldResponse(response));
    }
}
