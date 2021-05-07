package rfctest;

import com.google.gson.Gson;
import com.sap.cloud.sdk.cloudplatform.connectivity.Destination;
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.cloud.sdk.s4hana.connectivity.exception.RequestExecutionException;
import com.sap.cloud.sdk.s4hana.connectivity.rfc.RfmRequest;
import com.sap.cloud.sdk.s4hana.connectivity.rfc.RfmRequestResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.annotation.HttpConstraint;
import javax.servlet.annotation.ServletSecurity;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/rfc")
@ServletSecurity(@HttpConstraint(rolesAllowed = { "Display" }))
public class RfcServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger logger = LoggerFactory.getLogger(RfcServlet.class);
    private static final Destination destinationRfc =
            DestinationAccessor.getDestination("SAP_ABAP_BACKEND_RFC");

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws IOException {

        logger.info("Start get method: " + request.getRequestURI());
        String parameter = request.getParameter("name");
        logger.info("Get parameter 'name': " + parameter);
        if (parameter == null) {
            parameter = "USER_NAME_GET";
        }
        Iterable names = destinationRfc.getPropertyNames();
        logger.info(new Gson().toJson(names));

        try {
            final RfmRequestResult rfmTest = new RfmRequest(parameter, false) //false is for non-commit
                    .execute(destinationRfc);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(new Gson().toJson(rfmTest));
        } catch (RequestExecutionException e) {
            e.printStackTrace();
        }
    }
}