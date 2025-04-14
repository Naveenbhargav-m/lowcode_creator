import { signal } from "@preact/signals";

let tablesGlobalSignals = signal({
  "users": ["Name", "Age", "Bio", "posts"],
  "posts": ["CreatedBy", "CreatedAt", "Description", "Duration"],
});
  
  let fieldsGlobalSignals = signal({
    users: [
      { name: "id", type: "uuid", primary: true },
      { name: "name", type: "text", required: true },
      { name: "email", type: "text", required: true },
      { name: "created_at", type: "timestamp", default: "now()" }
    ],
    posts: [
      { name: "id", type: "uuid", primary: true },
      { name: "title", type: "text", required: true },
      { name: "content", type: "text" },
      { name: "author_id", type: "uuid", foreignKey: "users.id" },
      { name: "created_at", type: "timestamp", default: "now()" }
    ],
    "others": [],
    "new": [],
  });
  
  let screensGlobalSignals = signal([
    {
      id: "home_screen",
      name: "Home Screen",
      layout: "grid",
      components: ["UserList", "PostFeed"]
    },
    {
      id: "admin_dashboard",
      name: "Admin Dashboard",
      layout: "flex",
      components: ["UserForm", "PostForm"]
    }
  ]);
  
  let formsGlobalSignals = signal([
    {
      id: "user_form",
      table: "users",
      fields: ["name", "email"]
    },
    {
      id: "post_form",
      table: "posts",
      fields: ["title", "content", "author_id"]
    }
  ]);
  
  let queriesGlobalSignals = signal([
    {
      id: "get_users",
      name: "Get All Users",
      sql: "SELECT * FROM users"
    },
    {
      id: "get_user_posts",
      name: "Get Posts by User",
      sql: "SELECT * FROM posts WHERE author_id = $1"
    }
  ]);
  
  let userGlobalData = signal({
    id: "admin123",
    name: "Admin User",
    role: "admin",
    preferences: {
      theme: "dark",
      language: "en"
    }
  });
  
export {tablesGlobalSignals, fieldsGlobalSignals, screensGlobalSignals, formsGlobalSignals, queriesGlobalSignals, userGlobalData};