

class student{
  constructor(id,name,age, email, grades=[]){
    this.id = id;
    this.name = name;
    this.age = age;
    this.email = email;
    this.grades = grades;

    
  }
   updateGrades( newgrades){
    
    this.grades=[...newgrades];
    return this.grades;
   }

   avrgGrades(){
       if (this.grades.length === 0) {
        return 0;
       } 
    let sum = 0;
      for (let i of this.grades) {
        sum += i;
       }
         let average = sum / this.grades.length;
    return average;
   }
   findStudent(studentid){
    if(this.id === studentid){
      return this;
    }else{
      return "student not found"
    }
    }
}
let dex = new student("1","shemssa", "23", "pas@gmail.com", [90,80,70]
);

console.log(dex)
console.log(dex.updateGrades([60,80,60]))
console.log(dex.avrgGrades())
console.log(dex.findStudent("2"))