const contents = [
  "Observer pattern\n\n觀察者模式是軟體設計模式的一種。在此種模式中，一個目標物件管理所有相依於它的觀察者物件，並且在它本身的狀態改變時主動發出通知。這通常透過呼叫各觀察者所提供的方法來實現。此種模式通常被用來實時事件處理系統。\n",
  "Strategy pattern\n\n策略模式作爲一種軟體設計模式，指對象有某個行爲，但是在不同的場景中，該行爲有不同的實現算法。比如每個人都要「交個人所得稅」，但是「在美國交個人所得稅」和「在中國交個人所得稅」就有不同的算稅方法。\n",
  "Reactor pattern\n\n反應器設計模式(Reactor pattern)是一種為處理服務請求並發 提交到一個或者多個服務處理程序的事件設計模式。當請求抵達後，服務處理程序使用解多路分配策略，然後同步地派發這些請求至相關的請求處理程序。\n",
  "Composite pattern\n\nIn software engineering, the composite pattern is a partitioning design pattern. The composite pattern describes that a group of objects is to be treated in the same way as a single instance of an object. The intent of a composite is to \"compose\" objects into tree structures to represent part-whole hierarchies. Implementing the composite pattern lets clients treat individual objects and compositions uniformly."
];

let ai = 0;
let notes = contents.map( content => ({
  id: ++ai,
  content
}));

export default {

  get (callback) {
    setTimeout( () => callback({
      lastId: ai,
      notes
    }), 100);
  }

}
