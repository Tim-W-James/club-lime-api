const http = require("http");

const port = process.env.PORT || 3000;

const server = http.createServer(async (_req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  const clubLoads = await getClubLoadForAll();
  console.debug(`Club loads: ${JSON.stringify(clubLoads, null, 2)}`);
  res.end(JSON.stringify(clubLoads, null, 2));
});

server.listen(port, () => {
  console.log(`Server running on [${port}]`);
});

const clubIdMapping = {
  62: "Gungahlin Platinum",
  15: "Mitchell",
  18: "Braddon",
};

const getClubLoad = async (clubId) => {
  const res = await fetch(
    `https://www.clublime.com.au/default/includes/display_objects/custom/members/remote/clubload.cfm?cid=${clubId}&showone=&isMobile=false`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0",
        Accept: "*/*",
        "Accept-Language": "en-GB,en;q=0.5",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-GPC": "1",
        "Alt-Used": "www.clublime.com.au",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Priority: "u=0",
      },
      referrer: "https://www.clublime.com.au/members/",
      method: "GET",
      mode: "cors",
    }
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch club load data for [${clubId}]: [${res.status} ${res.statusText}]`
    );
  }

  const html = await res.text();

  const load = html.match(/<strong[^>]*>(\d{1,3}(?:\.\d+)?)%<\/strong>/);

  if (!load) {
    throw new Error(`Failed to parse club load data for [${clubId}]`);
  }

  return load[1];
};

const getClubLoadForAll = async () =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(clubIdMapping).map(async ([clubId, clubName]) => {
        const load = await getClubLoad(clubId);
        return [clubName, load];
      })
    )
  );
