import Mysheet from "./mysheet";
import ExcelComparator from "./compareExcel";
const page = () => {
  return (
    <div style={{ justifyItems: "center", margin: 2 }}>
      <h1>Welcome to Excel Sheet Comparator</h1>

      <Mysheet style={{ justifyItems: "center" }}></Mysheet>
      <ExcelComparator style={{ justifyItems: "center" }}></ExcelComparator>
    </div>
  );
};

export default page;
