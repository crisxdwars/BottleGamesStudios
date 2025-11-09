document.addEventListener("DOMContentLoaded", async () => {
  const cards = document.querySelectorAll(".profile-card");

  const userIds = [...cards]
    .map(card => card.dataset.userid)
    .filter(id => id !== "0");

  let presenceData = {};
  try {
    const res = await fetch("https://presence.roblox.com/v1/presence/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: userIds.map(Number) }),
    });
    const data = await res.json();
    data.userPresences.forEach(u => {
      presenceData[u.userId] = u.userPresenceType === 2 ? "Online" : "Offline";
    });
  } catch (err) {
    console.warn("Presence API fetch failed:", err);
  }

  cards.forEach(async (card) => {
    const userId = card.dataset.userid;
    const friendsEl = card.querySelector(".friends");
    const followersEl = card.querySelector(".followers");

    const statusEl = document.createElement("div");
    statusEl.className = "profile-status";
    card.querySelector(".profile-info").appendChild(statusEl);

    if (userId === "0") {
      friendsEl.textContent = "N/A";
      followersEl.textContent = "N/A";
      statusEl.innerHTML = `<span class="status-dot offline"></span> Offline`;
      return;
    }

    try {
      const [friendsRes, followersRes] = await Promise.all([
        fetch(`/api/roblox/friends/${userId}`), // Endpoint for Friends count
        fetch(`/api/roblox/followers/${userId}`) // Endpoint for Followers count
      ]);

      const friendsData = await friendsRes.json();
      const followersData = await followersRes.json();

      friendsEl.textContent = friendsData.count.toLocaleString();
      followersEl.textContent = followersData.count.toLocaleString();

      // Add Online/Offline status
      const status = presenceData[userId];
      if (status === "Online") {
        statusEl.innerHTML = `<span class="status-dot online"></span> Online`;
      } else {
        statusEl.innerHTML = `<span class="status-dot offline"></span> Offline`;
      }
    } catch (err) {
      console.error(`Error fetching Roblox data for user ${userId}:`, err);
      friendsEl.textContent = "N/A";
      followersEl.textContent = "N/A";
      statusEl.innerHTML = `<span class="status-dot offline"></span> Offline`;
    }
  });
});

function apply() {
      window.location.href = "../apply_form/";
}