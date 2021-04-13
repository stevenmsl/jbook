import { Fragment } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
/*
  design decisions 
  - why add AddCell here not in CellLisItem
    - we are showing an extra AddCell at the 
      very end of the list, which means we need
      to render it separately in this case       
*/

const CellList: React.FC = () => {
  /*
    - use destructure to retrieve the order and data
      properties out of the cells
    - re-organize the data array so it follows the 
      order specified in the order property
  */
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  const renderCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));
  return (
    <div>
      <AddCell forceVisible={cells.length === 0} previousCellId={null} />
      {renderCells}
    </div>
  );
};

export default CellList;
