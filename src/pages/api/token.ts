// pages/api/token.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Exchange the code for an access_token
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '';
    const clientSecret = process.env.DISCORD_CLIENT_SECRET || '';

    console.log(" clientId: ", clientId);
    console.log(" clientSecret: ", clientSecret);
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: req.body.code,
      }),
    });

    // Retrieve the access_token from the response
    const { access_token } = await response.json();

    // Return the access_token to our client as { access_token: "..."}
    res.status(200).json({ access_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
