const card_base_style = {
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    border: "1px solid #ddd",
};

const container_base_style = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px",
};

const row_base_style = {
    display: "flex",
    flexWrap: "wrap",
    margin: "-8px", // Adjust for gutters
};

const column_base_style = {
    flex: "1",
    height:"100%",
    width:"100%",
    backgroundColor:"green",
    padding: "8px", // Match row margin for gutters
};

const grid_view_base_style = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
};

const list_view_base_style = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
};

const scroll_area_base_style = {
    display: "block",
    maxHeight: "400px",
    overflowY: "auto",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
};

const carousel_base_style = {
    display: "flex",
    overflowX: "auto",
    gap: "16px",
    scrollSnapType: "x mandatory",
    padding: "8px",
};

const ContainersStylesMap = {
    card: card_base_style,
    container: container_base_style,
    row: row_base_style,
    column: column_base_style,
    grid_view: grid_view_base_style,
    list_view: list_view_base_style,
    scroll_area: scroll_area_base_style,
    carousel: carousel_base_style,
};

export { ContainersStylesMap };
