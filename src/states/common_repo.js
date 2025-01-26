import { reactSchematic, breakpoints } from "react-schematic";


const grid_columns = 1048;
const grid_rows = 900;
// Define breakpoints
let custom = {
    xs: 0,
    sm: 900,
    md: 900,
    lg: 1200,
    xl: 1536,
  };
  
  // Get responsive styled components
  const { Container, Flex, FlexItem, Grid, GridItem } = reactSchematic(
    custom || breakpoints
  );

  let GridContainer = Container;
  export {GridContainer, Flex, FlexItem, Grid, GridItem , grid_columns, grid_rows};