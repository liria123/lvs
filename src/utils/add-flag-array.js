export default function fetchAddFlagArray(table_list) {
  const tempArr = [];
  table_list.forEach(el => {
    if (el.add_flag) {
      tempArr.push(el);
    }
  });
  return tempArr;
}
