/* 
 * This program is to solve the family tree problem
 * User JSON to store the family tree
 * ADD_CHILD adds child via mother in JSON
 * GET_RELATIONSHIP is fetched from the JSON applicable relations are present in an arraz
 */

// All imports
const fs = require('fs');
const familyJson = require('./family.json');


// Variables & Constants Declaration
const fileName = process.argv[2];

// Load the initial Family tree. familyJ is global to save altered fam tree
let familyJ = familyJson;

start(fileName);
function start(fileName) {
	fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) {
			process.stdout.write("ERROR_READING_FILE")
			return
		}
		const usecaseArray = data.split("\r\n");

		for (var i = 0; i < usecaseArray.length; i++) {
			const conditions = usecaseArray[i].split(/\s+/);
			//console.log("Test Case " + (i + 1) + " " + usecaseArray[i]);
			//console.log(conditions)
			if (conditions[0] == "ADD_CHILD") {

				// If statement word length less than 4 log error
				if (conditions.length < 4) {
					console.log("CHILD_ADDITION_FAILED")
					break;
				} else {
					let motherName = conditions[1]
					let name = conditions[2]
					let gender = conditions[3]
					addChild(name, motherName, gender, familyJ);
				}
			} else if (conditions[0] == "GET_RELATIONSHIP") {
				//console.log("GET_RELATIONSHIP")

				// If statement word length less than 3 log error
				if (conditions.length < 3) {
					process.stdout.write("NONE")
					break;
				} else {
					let name = conditions[1]
					let relationShip = conditions[2]
					getRelationShip(name, relationShip);
				}

			}

		}

	})
}


// Function to add child 
function addChild(name, motherName, gender, familyJ) {
    let added = false;

    for (let j = 0; j < familyJ.family.length; j++)  {
        let person = familyJ.family[j];
        
        // Add child if the person mentioned as mother is available, female & married
        if (person.name == motherName && person.gender == "Female" && person.spouseId != null) {

            let childJson = {
                "id": familyJ.total + 1,
                "name": name,
                "gender": gender,
                "fatherId": person.spouseId,
                "motherId": person.id,
                "spouseId": null
            }
            familyJ.total = familyJ.total + 1;
            familyJ.family.push(childJson)
            added = true;
            //console.log(familyJ.family);

            //let e = JSON.stringify(familyJ);
            //fs.writeFileSync('./family.json', e);

            // Result
            process.stdout.write("CHILD_ADDITION_SUCCEEDED"+ '\n')
            break;
        } else if (person.name == motherName && (person.gender == "Male" || person.spouseId == null )) {
            added = true;

            // Result
            process.stdout.write("CHILD_ADDITION_FAILED"+ '\n')
            break;
        }
    };

    if (!added) {
        // Result
        process.stdout.write("PERSON_NOT_FOUND"+ '\n')
    }
}


/* Switch case to select Relationship */
function getRelationShip(name, relationShip) {
let siblingGender, spouseSiblingGender = null;
    switch (relationShip){
      case "Son":
		getChild(name, "Male");
		break;
      case "Daughter":
		getChild(name, "Female");
		break;
      case "Siblings":
		const person= familyJ.family.find(x => x.name == name);
		if(person){
			getSiblings(person);
		}else{	
			process.stdout.write("PERSON_NOT_FOUND"+ '\n')			
		}
		break;
	  case "Paternal-Uncle":
	    getUncleorAunt(name, "Male", "Paternal");
		break;
	  case "Paternal-Aunt":
	    getUncleorAunt(name, "Female","Paternal");
		break;
	  case "Maternal-Uncle":
	    getUncleorAunt(name, "Male", "Maternal");
		break;
	  case "Maternal-Aunt":
	    getUncleorAunt(name, "Female","Maternal");
		break;
	  case "Sister-In-Law":
		siblingGender = "Male"
		spouseSiblingGender = "Female"
		getInlaw(name, siblingGender, spouseSiblingGender);
		break;
	  case "Brother-In-Law":
	    siblingGender = "Female"
	    spouseSiblingGender = "Male"

		getInlaw(name, siblingGender, spouseSiblingGender);
		break;
	}    

}

/* Function to get Son/Daughter */
function getChild(name, gender) {	
    let parentId = 0;
	let found = false;
	for (let j = 0; j < familyJ.family.length; j++)  {
        let person = familyJ.family[j];
		if(person.name == name){
			parentId = person.id
		}
		if((person.fatherId == parentId || person.motherId == parentId) && (person.gender == gender)){
			found = true;
			process.stdout.write(person.name+" ");
		}		
	}
	if(!found){
		process.stdout.write("NONE"+ '\n')
	}else{
		process.stdout.write('\n')
	}
}

/* Function to get Siblings */
function getSiblings(personA) {	
	let found = false;
	fatherId = personA.fatherId;
	motherId = personA.motherId;
	name = personA.name;
	for (let j = 0; j < familyJ.family.length; j++)  {
        let person = familyJ.family[j];
		if(person.fatherId == fatherId && person.motherId == motherId && person.name != name){
			found = true;
			process.stdout.write(person.name+" ");
		}		
	}
	if(!found){
		process.stdout.write("NONE"+ '\n')
	}else{
		process.stdout.write('\n')
	}
}


/* Function to get Uncle/Aunt */
function getUncleorAunt(name, gender, x) {	
	let found = false;	
	const personA = familyJ.family.find(x => x.name == name);
	if(personA){
		let parentt;
		if(x == "Paternal"){
			parentt = familyJ.family.find(x => x.id == personA.fatherId);
		}else if(x == "Maternal"){			
			parentt = familyJ.family.find(x => x.id == personA.motherId);
		}
		//console.log(parentt)
		if (parentt && parentt.fatherId != null && parentt.motherId != null){
			for (let j = 0; j < familyJ.family.length; j++)  {
				let person = familyJ.family[j];
				if(person.fatherId == parentt.fatherId && person.motherId == parentt.motherId && person.gender == gender 
				&& person.id != personA.fatherId && person.id != personA.motherId){
					found = true;
					process.stdout.write(person.name+" ");
				}		
			}
			
		} else {
			found = true;
			process.stdout.write("PERSON_NOT_FOUND")
		}
	} else {
		found = true;
		process.stdout.write("PERSON_NOT_FOUND")
	}
	if(!found){
		process.stdout.write("NONE"+ '\n')
	}else{
		process.stdout.write('\n')
	}
}

/* Function to get Sis in law/ Bro in law*/
function getInlaw(name, siblingGender, spouseSiblingGender) {
	let found = false;
	const personA = familyJ.family.find(x => x.name == name);
	var arrayOfSpouseIds = []

	for (let j = 0; j < familyJ.family.length; j++) {
		let person = familyJ.family[j];
		/* Use case 1 - Sis in law - Spouse's Sibling Female
		 * Bro in law - Spouse's Sibling Male
		 */
		if (personA.spouseId != null) {
			const spouseofA = familyJ.family.find(x => x.id == personA.spouseId);

			fatherId = spouseofA.fatherId;
			motherId = spouseofA.motherId;
			name = spouseofA.name;
			if (person.fatherId == fatherId && person.motherId == motherId && person.gender == spouseSiblingGender && person.id != spouseofA.id) {
				found = true;
				process.stdout.write(person.name + " ");
			}
		}
		/* Use case 2 - Sis in law - Male sibling's wife
		 * Bro in law - Female sibling's husband
		 */
		if (person.fatherId != null && person.motherId != null && person.fatherId == personA.fatherId && person.motherId == personA.motherId && person.gender == siblingGender && person.spouseId != null && person.id != personA.id) {
			arrayOfSpouseIds.push(person.spouseId)
		}



	}

	if (arrayOfSpouseIds.length > 0) {
		for (let j = 0; j < familyJ.family.length; j++) {
			let person = familyJ.family[j];
			if (arrayOfSpouseIds.includes(person.id)) {
				found = true;
				process.stdout.write(person.name + " ");
			}
		}
	}

	if (!found) {
		process.stdout.write("NONE" + '\n')
	} else {
		process.stdout.write('\n')
	}

}
// Export so that start Could be used from other files
exports.start = start;