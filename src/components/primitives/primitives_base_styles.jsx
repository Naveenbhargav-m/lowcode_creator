const text_base_style = {
    display: "flex",
    overflow: "hidden",
    fontSize: "0.8em",
    color: "#333",
    lineHeight: "1.4",
};

const number_base_style = {
    display: "inline-block",
    textAlign: "right",
    fontSize: "1em",
    color: "#222",
};

const text_area_base_style = {
    display: "block",
    width: "100%",
    height: "100px",
    padding: "8px",
    fontSize: "0.9em",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "4px",
    resize: "vertical",
};

const avatar_base_style = {
    display: "inline-block",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
};

const avatar_group_base_style = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const progress_bar_base_style = {
    display: "block",
    width: "100%",
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
};

const drop_down_base_style = {
    display: "inline-block",
    position: "relative",
    width: "200px",
    padding: "8px",
    fontSize: "0.9em",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
};

const button_base_style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    fontSize: "0.9em",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};

const image_base_style = {
    display: "block",
    maxWidth: "100%",
    height: "auto",
    borderRadius: "4px",
};

const badge_base_style = {
    display: "inline-block",
    padding: "4px 8px",
    fontSize: "0.75em",
    color: "#fff",
    backgroundColor: "#007BFF",
    borderRadius: "12px",
};

const icon_base_style = {
    display: "inline-block",
    width: "16px",
    height: "16px",
    fill: "currentColor",
};

const icon_button_base_style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    color: "#007BFF",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
};

const PrimitivesStylesMap = {
    text: text_base_style,
    number: number_base_style,
    text_area: text_area_base_style,
    avatar: avatar_base_style,
    avatar_group: avatar_group_base_style,
    progress_bar: progress_bar_base_style,
    drop_down: drop_down_base_style,
    button: button_base_style,
    image: image_base_style,
    badge: badge_base_style,
    icon: icon_base_style,
    icon_button: icon_button_base_style,
};

export { PrimitivesStylesMap };
