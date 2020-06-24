const person = {
  myName: "Harcop",
  introduction: function() {
    return `Hi, I'm ${this.myName}`;
  }
};

const introduction = person.introduction;
console.log(introduction());

const definer = introduction.bind(person);
console.log(definer());
