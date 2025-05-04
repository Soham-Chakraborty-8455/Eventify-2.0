import React from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";

const QrCodeReader = () => {
  const VerifyTicket = async (details) => {
    if (!details.userid && !details.eventid) {
      alert("Invalid QR");
      return;
    }
    try {
      //!posting the details to backend ----------------------------
      const response = await axios.get(
        `/verify-ticket/${details.eventid}/${details.userid}`
      );
      console.log(response);
      alert("Ticket Verified");
      // setRedirect(true);
      // console.log("Success creating ticket", updatedTicketDetails);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div style={{ height: "500px", width: "500px" }}>
      <Scanner
        onScan={(result) => VerifyTicket(JSON.parse(result[0].rawValue))}
      />
    </div>
  );
};

export default QrCodeReader;
