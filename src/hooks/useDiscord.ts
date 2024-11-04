import { DiscordSDK } from "@discord/embedded-app-sdk";
import { useEffect, useState } from "react";

export const useDiscord = () => {
  const [channelName, setChannelName] = useState("Unknown");
  const [discordSDK, setDiscordSDK] = useState<DiscordSDK>();
  const [auth, setAuth] = useState<any>();
  const [username, setUsername] = useState("")
  const [clientId] = useState(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "");

  const appendVoiceChannelName = async () => {
    let activityChannelName = "Unknown";

    // Requesting the channel in GDMs (when the guild ID is null) requires
    // the dm_channels.read scope which requires Discord approval.
    if (
      discordSDK &&
      discordSDK.channelId != null &&
      discordSDK.guildId != null
    ) {
      // Over RPC collect info about the channel
      const channel = await discordSDK.commands.getChannel({
        channel_id: discordSDK.channelId,
      });
      console.log(" channel: ", channel);
      if (channel.name != null) {
        activityChannelName = channel.name;
      }
    }

    setChannelName(activityChannelName);
  };

  const exitDiscordActivity = async () => {
    if (!discordSDK) return;
    await discordSDK.close(1000, "Game completed");
  }

  const setupDiscordSDK = async () => {
    if (!discordSDK) return;
    console.log("Discord SDK is connecting...");
    await discordSDK.ready();
    console.log("Discord SDK is ready");

    // Authorize with Discord Client
    const { code } = await discordSDK.commands.authorize({
      client_id: clientId,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify", "guilds", "applications.commands"],
    });

    // Retrieve an access_token from your activity's server
    // Note: We need to prefix our backend `/api/token` route with `/.proxy` to stay compliant with the CSP.
    // Read more about constructing a full URL and using external resources at
    // https://discord.com/developers/docs/activities/development-guides#construct-a-full-url
    const response = await fetch("/.proxy/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });
    const { access_token } = await response.json();

    // Authenticate with Discord client (using the access_token)
    const authResponse = await discordSDK.commands.authenticate({
      access_token,
    });

    setUsername(authResponse.user.global_name || authResponse.user.username);

    console.log(" authResponse: ", authResponse);

    setAuth(authResponse);

    if (authResponse === null) {
      throw new Error("Authenticate command failed");
    }
  };
  useEffect(() => {
    const discordSDK = new DiscordSDK(clientId);
    console.log("discordSDK: ", discordSDK);
    setDiscordSDK(discordSDK);
  }, []);

  useEffect(() => {
    (async () => {
      await setupDiscordSDK();
      await appendVoiceChannelName();
    })();
  }, [discordSDK]);

  return {
    auth,
    username,
    channelName,
    exitDiscordActivity,
  };
};
