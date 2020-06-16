"use strict";

const fetch = require("node-fetch");

// Mailchimp env variables
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_TARGET_LIST = process.env.MAILCHIMP_TARGET_LIST;
const MAILCHIMP_API_USERNAME = process.env.MAILCHIMP_API_USERNAME || "metacall";

// Mailchimp endpoint using v3.0
const dc = MAILCHIMP_API_KEY.split("-")[1];
const apiUrl = `https://${dc}.api.mailchimp.com/3.0`;
// Authorization
const auth = {
  username: MAILCHIMP_API_USERNAME,
  password: MAILCHIMP_API_KEY,
};

/**
 *
 * Subscribe to a mailchimp list
 * Accepts an email and a mailchimp-contact status
 *
 * More about mailchimp contact status here:
 * https://mailchimp.com/developer/guides/manage-subscribers-with-the-mailchimp-api/#Add_a_contact_status
 *
 * @param {string} email
 * @param {string} [status="pending"] - [subscribed || pending || unsubscribed || cleaned]
 */
async function subscribe(email, status = "pending") {
  try {
    const req = await fetch(
      `${apiUrl}/lists/${MAILCHIMP_TARGET_LIST}/members`,
      {
        method: "post",
        body: JSON.stringify({
          email_address: email,
          status,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${auth.username}:${auth.password}`
          ).toString("base64")}`,
        },
      }
    );
    const resp = await req.json();
    return resp;
  } catch (e) {
    return e;
  }
}

module.exports = {
  subscribe,
};
