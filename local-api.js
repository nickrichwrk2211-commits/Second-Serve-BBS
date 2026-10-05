(() => {
  const storageKey = "secondserve-local-demo-v1";
  let memoryState;
  const now = () => new Date().toISOString();
  const id = () => globalThis.crypto?.randomUUID?.() || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const at = (hour, days = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    if (!days && date.getTime() < Date.now()) date.setDate(date.getDate() + 1);
    return date.toISOString();
  };
  const past = (days, hour) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, 0, 0, 0);
    return date.toISOString();
  };

  const organizations = [
    ["rest-1", "Northside Table", "Restaurant", "18 King Street", "kitchen@northside.example", "verified"],
    ["rest-2", "Morrow Bakehouse", "Bakery", "42 Cedar Avenue", "hello@morrow.example", "verified"],
    ["rest-3", "The Green Apron", "Restaurant", "7 Market Lane", "team@greenapron.example", "verified"],
    ["rest-4", "Harbor House Hotel", "Hotel", "90 Wharf Road", "food@harborhouse.example", "verified"],
    ["rest-5", "Little Orchard Cafe", "Cafe", "12 Orchard Walk", "care@orchard.example", "verified"],
    ["ngo-1", "Open Door Community Kitchen", "Community kitchen", "3 Hope Street", "hello@opendoor.example", "verified"],
    ["ngo-2", "Eastside Neighbourhood Pantry", "Food pantry", "55 Union Road", "team@eastside.example", "verified"],
    ["ngo-3", "New Roots Outreach", "Outreach organization", "21 Station Road", "care@newroots.example", "verified"],
    ["ngo-4", "Bright Path Youth Centre", "Community centre", "6 Willow Close", "info@brightpath.example", "pending"],
  ].map(([id, name, type, address, contact, verificationStatus]) => ({ id, name, type, address, contact, verificationStatus }));

  const listing = (number, restaurantId, foodName, category, quantity, unit, kilograms, description, status, day, claimOrg) => {
    const organization = organizations.find((item) => item.id === restaurantId);
    const completed = status === "completed";
    const start = completed ? past(day, 16) : at(17);
    const claim = claimOrg ? {
      id: `claim-food-${number}`, foodListingId: `food-${number}`,
      organizationId: claimOrg, organizationName: organizations.find((item) => item.id === claimOrg).name,
      claimedAt: past(day, 12), pickupTime: start,
      ...(completed ? { receivedAt: start, status: "received" } : { status: "claimed" }),
    } : undefined;
    return {
      id: `food-${number}`, restaurantId, restaurantName: organization.name,
      foodName, category, quantity, unit, kilograms,
      pickupLocation: `${organization.address}, ${restaurantId === "rest-1" ? "rear entrance" : restaurantId === "rest-2" ? "side door" : restaurantId === "rest-3" ? "loading bay" : restaurantId === "rest-4" ? "service entrance" : "front counter"}`,
      pickupStart: start, pickupEnd: completed ? past(day, 19) : at(20),
      expirationTime: completed ? past(day, 21) : at(21), description, status,
      createdAt: completed ? past(day + 1, 10) : now(), ...(claim ? { claim } : {}),
    };
  };

  const seed = () => ({
    userId: null,
    users: [
      { user: { id: "user-restaurant", name: "Maya Chen", email: "restaurant@secondserve.demo", role: "restaurant", organizationId: "rest-1", organizationName: "Northside Table", verificationStatus: "verified" }, password: "demo1234" },
      { user: { id: "user-ngo", name: "Amara Johnson", email: "ngo@secondserve.demo", role: "ngo", organizationId: "ngo-1", organizationName: "Open Door Community Kitchen", verificationStatus: "verified" }, password: "demo1234" },
      { user: { id: "user-admin", name: "Jordan Lee", email: "admin@secondserve.demo", role: "admin", verificationStatus: "verified" }, password: "demo1234" },
      { user: { id: "user-admin-primary", name: "admin123", username: "admin123", email: "admin@gmail.com", role: "admin", verificationStatus: "verified" }, password: "admin321" },
    ],
    organizations: clone(organizations),
    listings: [
      listing(1, "rest-1", "Cooked rice", "Prepared food", 20, "kg", 20, "Freshly prepared plain rice, cooled and stored safely.", "completed", 7, "ngo-1"),
      listing(2, "rest-2", "Bread and rolls", "Bakery", 15, "portions", 4, "Assorted day-fresh loaves and rolls.", "completed", 6, "ngo-2"),
      listing(3, "rest-3", "Prepared vegetable meals", "Prepared food", 30, "portions", 18, "Vegetable pasta meals in sealed containers. Contains wheat.", "completed", 5, "ngo-3"),
      listing(4, "rest-4", "Seasonal vegetables", "Produce", 10, "kg", 10, "Washed, uncut seasonal vegetables stored chilled.", "completed", 4, "ngo-1"),
      listing(5, "rest-5", "Bakery assortment", "Bakery", 25, "items", 6, "A mixed box of muffins and pastries. Contains dairy and wheat.", "completed", 3, "ngo-2"),
      listing(6, "rest-1", "Lentil soup", "Prepared food", 12, "portions", 8, "Chilled lentil soup in sealed, labelled containers.", "completed", 2, "ngo-3"),
      listing(7, "rest-2", "Sourdough loaves", "Bakery", 8, "loaves", 4, "Whole sourdough loaves baked this morning.", "available", 0),
      listing(8, "rest-3", "Seasonal vegetable boxes", "Produce", 10, "kg", 10, "A mix of fresh seasonal vegetables, kept chilled.", "available", 0),
      listing(9, "rest-4", "Dinner meal boxes", "Prepared food", 14, "portions", 9, "Sealed vegetarian dinner boxes, labelled with ingredients.", "available", 0),
      listing(10, "rest-5", "Fruit and yogurt cups", "Produce", 16, "portions", 5, "Chilled seasonal fruit cups. Contains dairy.", "claimed", 0, "ngo-1"),
    ],
    impact: {
      foodRescuedKg: 66, mealsDistributed: 792, activeListings: 3, completedPickups: 6,
      partnerRestaurants: 5, partnerOrganizations: 4, backupMealsServed: 84,
      eventsFundraising: 3, moneyRaised: 4250,
      weeklyFood: [
        { week: "Aug 9", kilograms: 18 }, { week: "Aug 16", kilograms: 24 },
        { week: "Aug 23", kilograms: 17 }, { week: "Aug 30", kilograms: 31 },
        { week: "Sep 6", kilograms: 28 }, { week: "Sep 13", kilograms: 42 },
        { week: "Sep 20", kilograms: 36 }, { week: "Sep 27", kilograms: 54 },
      ],
      activity: [
        { id: "a1", text: "Open Door Kitchen collected lentil soup from Northside Table", time: "Today, 6:10 pm" },
        { id: "a2", text: "Eastside Pantry collected bakery boxes from Little Orchard Cafe", time: "Yesterday, 7:05 pm" },
        { id: "a3", text: "New Roots Outreach received 30 prepared meals", time: "2 days ago" },
        { id: "a4", text: "Harbor House Hotel joined as a verified partner", time: "3 days ago" },
      ],
    },
    audit: [],
  });

  const read = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      memoryState = stored ? JSON.parse(stored) : memoryState || seed();
    } catch {
      memoryState ||= seed();
    }
    return memoryState;
  };
  const save = (state) => {
    memoryState = state;
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Keep this session in memory when file storage is unavailable. */ }
  };
  const reply = (body, status = 200) => new Response(JSON.stringify(body), {
    status, headers: { "Content-Type": "application/json" },
  });
  const problem = (message, status = 400) => reply({ error: message }, status);
  const record = (state, actorId, entity, entityId, action) => state.audit.unshift({ id: id(), actorId, entity, entityId, action, at: now() });
  const updateImpact = (state) => {
    state.impact.activeListings = state.listings.filter((item) => item.status === "available").length;
    state.impact.completedPickups = state.listings.filter((item) => item.status === "completed").length;
    state.impact.foodRescuedKg = state.listings.filter((item) => item.status === "completed").reduce((sum, item) => sum + item.kilograms, 0);
    state.impact.mealsDistributed = Math.round(state.impact.foodRescuedKg * 12);
  };
  const currentUser = (state) => state.users.find((entry) => entry.user.id === state.userId)?.user || null;
  const requireRole = (state, ...roles) => {
    const user = currentUser(state);
    if (!user) return { error: "Please sign in to continue.", status: 401 };
    if (!roles.includes(user.role)) return { error: "Your account cannot do that.", status: 403 };
    return { user };
  };

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    let url;
    try { url = new URL(typeof input === "string" ? input : input.url, location.href); }
    catch { return nativeFetch(input, init); }
    if (!url.pathname.startsWith("/api/")) return nativeFetch(input, init);

    const state = read();
    const method = String(init.method || "GET").toUpperCase();
    const path = url.pathname.replace(/^\/api/, "");
    let body = {};
    try { body = init.body ? JSON.parse(init.body) : {}; } catch { return problem("Invalid request data."); }

    if (path === "/data" && method === "GET") {
      const data = { user: currentUser(state), organizations: clone(state.organizations), listings: clone(state.listings), impact: clone(state.impact), demoMode: true };
      if (data.user?.role === "restaurant") data.listings = data.listings.filter((item) => item.restaurantId === data.user.organizationId);
      else if (data.user?.role !== "admin") data.listings = data.listings.map((item) => item.claim?.organizationId === data.user?.organizationId ? item : { ...item, pickupLocation: "Pickup details shared after claim" });
      return reply(data);
    }
    if (path === "/health" && method === "GET") return reply({ ok: true, demoMode: true });
    if (path === "/auth/login" && method === "POST") {
      const identifier = String(body.identifier || "").trim().toLowerCase();
      const entry = state.users.find((item) => item.user.email.toLowerCase() === identifier || item.user.username?.toLowerCase() === identifier);
      if (!entry || entry.password !== body.password) return problem("Email or password is incorrect.", 401);
      state.userId = entry.user.id;
      save(state);
      return reply({ user: entry.user });
    }
    if (path === "/auth/register" && method === "POST") {
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim();
      const organizationName = String(body.organizationName || "").trim();
      if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || String(body.password || "").length < 10 || organizationName.length < 2 || !["restaurant", "ngo"].includes(body.role)) return problem("Check the registration details.");
      if (state.users.some((item) => item.user.email.toLowerCase() === email.toLowerCase())) return problem("An account already exists for this email.", 409);
      const organization = { id: id(), name: organizationName, type: body.role === "restaurant" ? "Restaurant" : "Community organization", address: "Address pending verification", contact: email, verificationStatus: "pending" };
      const user = { id: id(), name, email, role: body.role, organizationId: organization.id, organizationName, verificationStatus: "pending" };
      state.organizations.push(organization);
      state.users.push({ user, password: body.password });
      state.userId = user.id;
      record(state, user.id, "organization", organization.id, "registered");
      save(state);
      return reply({ user }, 201);
    }
    if (path === "/auth/logout" && method === "POST") { state.userId = null; save(state); return reply({ ok: true }); }
    if (path === "/admin/audit" && method === "GET") {
      const auth = requireRole(state, "admin");
      return auth.error ? problem(auth.error, auth.status) : reply({ events: state.audit });
    }

    let match = path.match(/^\/listings\/([^/]+)\/(claim|receive)$/);
    if (match) {
      const auth = requireRole(state, match[2] === "claim" || match[2] === "receive" ? "ngo" : "visitor");
      if (auth.error) return problem(auth.error, auth.status);
      const user = auth.user;
      const listing = state.listings.find((item) => item.id === decodeURIComponent(match[1]));
      if (!listing) return problem("Food listing not found.", 404);
      const organization = state.organizations.find((item) => item.id === user.organizationId);
      if (user.verificationStatus !== "verified" || organization?.verificationStatus !== "verified") return problem("Only verified organizations can claim food.", 403);
      if (match[2] === "claim") {
        if (method !== "POST") return problem("Method not allowed.", 405);
        if (listing.status !== "available") return problem("This listing is no longer available.", 409);
        listing.status = "claimed";
        listing.claim = { id: id(), foodListingId: listing.id, organizationId: organization.id, organizationName: organization.name, claimedAt: now(), pickupTime: listing.pickupStart, status: "claimed" };
        record(state, user.id, "food_listing", listing.id, "claimed");
      } else {
        if (method !== "POST") return problem("Method not allowed.", 405);
        if (!listing.claim || listing.claim.organizationId !== user.organizationId) return problem("No pickup for this organization was found.", 404);
        if (listing.status !== "claimed") return problem("This pickup has already been completed.", 409);
        listing.status = "completed";
        listing.claim.status = "received";
        listing.claim.receivedAt = now();
        record(state, user.id, "food_listing", listing.id, "received");
        state.impact.weeklyFood.at(-1).kilograms += listing.kilograms;
        state.impact.activity.unshift({ id: id(), text: `${user.organizationName || "A community organization"} received ${listing.foodName} from ${listing.restaurantName}`, time: "Just now" });
      }
      updateImpact(state); save(state); return reply({ listing });
    }

    match = path.match(/^\/admin\/organizations\/([^/]+)\/verification$/);
    if (match && method === "PATCH") {
      const auth = requireRole(state, "admin");
      if (auth.error) return problem(auth.error, auth.status);
      if (!["verified", "rejected"].includes(body.status)) return problem("Choose verified or rejected.");
      const organization = state.organizations.find((item) => item.id === decodeURIComponent(match[1]));
      if (!organization) return problem("Organization not found.", 404);
      organization.verificationStatus = body.status;
      state.users.filter((item) => item.user.organizationId === organization.id).forEach((item) => { item.user.verificationStatus = body.status; });
      record(state, auth.user.id, "organization", organization.id, body.status); save(state);
      return reply({ organization });
    }
    match = path.match(/^\/admin\/listings\/([^/]+)$/);
    if (match && ["PATCH", "DELETE"].includes(method)) {
      const auth = requireRole(state, "admin");
      if (auth.error) return problem(auth.error, auth.status);
      const listingId = decodeURIComponent(match[1]);
      const listing = state.listings.find((item) => item.id === listingId);
      if (!listing) return problem("Food listing not found.", 404);
      if (listing.status !== "available") return problem("Claimed and completed records remain unchanged for traceability.", 409);
      if (method === "DELETE") {
        state.listings = state.listings.filter((item) => item.id !== listingId);
        record(state, auth.user.id, "food_listing", listing.id, "removed_by_admin");
        updateImpact(state); save(state); return reply({ ok: true });
      }
      if (!String(body.foodName || "").trim() || !String(body.pickupLocation || "").trim()) return problem("Check the food listing details.");
      Object.assign(listing, body);
      record(state, auth.user.id, "food_listing", listing.id, "updated_by_admin");
      updateImpact(state); save(state); return reply({ listing });
    }
    if (path === "/listings" && method === "POST") {
      const auth = requireRole(state, "restaurant");
      if (auth.error) return problem(auth.error, auth.status);
      const user = auth.user;
      const organization = state.organizations.find((item) => item.id === user.organizationId);
      if (user.verificationStatus !== "verified" || organization?.verificationStatus !== "verified") return problem("Your restaurant must be verified before posting listings.", 403);
      if (!String(body.foodName || "").trim() || !String(body.pickupLocation || "").trim() || !(Number(body.quantity) > 0) || !(Number(body.kilograms) > 0)) return problem("Check the listing details.");
      const listing = { ...body, quantity: Number(body.quantity), kilograms: Number(body.kilograms), id: id(), restaurantId: organization.id, restaurantName: organization.name, status: "available", createdAt: now() };
      state.listings.unshift(listing); record(state, user.id, "food_listing", listing.id, "created");
      updateImpact(state); save(state); return reply({ listing }, 201);
    }
    return problem("Not found.", 404);
  };
})();