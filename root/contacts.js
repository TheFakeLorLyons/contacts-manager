class Contact {
    constructor(name, phoneNumber, email, relation, notes) {
      this.name = name;
      this.phoneNumber = phoneNumber;
      this.email = email;
      this.relation = relation;
      this.notes = notes;
    }
  }

/*;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;                                        ;                 CRUD               ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;*/

//Adds a user into the current session local storage to simulate a backend
  function addContact(contact) {
    let sessionContacts = JSON.parse(localStorage.getItem('contacts')) || [];

    const nameExists = sessionContacts.some(existingContact => 
      existingContact.name.toLowerCase() === contact.name.toLowerCase()
    );
    
    if(contact.name  && !nameExists){
      sessionContacts.push(contact);
      localStorage.setItem('contacts', JSON.stringify(sessionContacts));   
      return true;       
    }
    else if(!contact.name){
      console.log("There has to be a name at least")
      alert("That failed because you didn\'t enter a name!")//Potentially show on the HTML instead
      return false;
    }
    else{
      console.log("There is already a contact with that name")
      alert("That failed because a contact with that name already exists!")
      return false;      
    }
  }

//Looks up an existing contact and returns that contact (or all that share that name)
  function findContactByName(name) {
    let sessionContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    return sessionContacts.find(contact => contact.name === name);
  }

//Clears the entirety of local storage
  function clearContacts() {
    if (confirm("Are you sure you want to delete EVERYTHING?")) {
      localStorage.setItem('contacts', JSON.stringify([]));
      alert("Contacts have been cleared.");
      displayContacts();
    } 
    else {
        alert("Operation cancelled.");
    }
  }

//Deletes a contact by name  
  function removeContactByName(name) {
    let sessionContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let initialLength = sessionContacts.length;

    // Filter out the contact(s) with the specified name
    let filteredContacts = sessionContacts.filter(contact => contact.name !== name);
  
    // Update localStorage with the filtered contacts
    localStorage.setItem('contacts', JSON.stringify(filteredContacts));
    //This will return true if we removed a contact from the list (used in handleDelete)
    return filteredContacts.length < initialLength;
  }

//Edits an existing contact 
  function updateContact(originalName, updatedContact) {
    let sessionContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let index = sessionContacts.findIndex(contact => contact.name === originalName);

    if (index !== -1) {
      sessionContacts[index] = updatedContact;
      localStorage.setItem('contacts', JSON.stringify(sessionContacts));
      return true;
    }
    return false;
  }

/*;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;                                        ;                 HTML               ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;*/

//Takes input from contact form
  function handleSubmit(event) {
    event.preventDefault();//This prevents the form from being auto-submitted
  
    // Taking the form values and assigning them to temporary variables
    let name = document.getElementById('name').value;
    let phoneNumber = document.getElementById('number').value;
    let email = document.getElementById('email').value;
    let relation = document.getElementById('relation').value;
    let notes = document.getElementById('notes').value;
  
    //Uses the entered fields to create a new contact
    let newContact = new Contact(name, phoneNumber, email, relation, notes);
  
    //Adds the created contact to local storage
    let addedSuccessful = addContact(newContact);

    //Clears the input fields upon hitting submit
    if(addedSuccessful){
      document.getElementById('name').value = '';
      document.getElementById('number').value = '';
      document.getElementById('email').value = '';
      document.getElementById('relation').value = '';
      document.getElementById('notes').value = '';
    
      //That sweet sweet feeling
      alert('Contact added successfully!');
      displayContacts();
    }
  }

//Handles deleting by name (delete all is simply called on the button)  
  function handleDelete(event) {
    event.preventDefault();//This prevents the form from being auto-submitted
  
    // Taking the form values and assigning them to temporary variables
    let name = document.getElementById('deleteName').value.trim();
  
    //Uses the entered fields to create a new contact
    let contactToDeleteName = name;
  
    if (nameToDelete) {
      //Adds the created contact to local storage
      let deleteSuccessful = removeContactByName(contactToDeleteName);

      //Clears the input fields upon hitting submit
      if(deleteSuccessful){
        displayContacts();
        alert(`Deleted contact with name: ${nameToDelete}`)
      }
      else{
        //Lets the user know if the submission failed
        alert('Failed to delete contact. Please try again.')
      }
    }
    else {
      alert('Please enter a name to delete.');
    }
  }  

//This is a hidden form that opens when someone wants to edit a contact.  
  function prefillEditForm(contact) {
    document.getElementById('originalName').value = contact.name;
    document.getElementById('editName').value = contact.name;
    document.getElementById('editPhoneNumber').value = contact.phoneNumber;
    document.getElementById('editEmail').value = contact.email;
    document.getElementById('editRelation').value = contact.relation;
    document.getElementById('editNotes').value = contact.notes;
    
    // Show the edit form
    document.getElementById('editForm').style.display = 'block';
  }

//Reads all the JSON objects contained in the local storage
  function displayContacts() {
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    let listElement = document.getElementById('contactList');
    listElement.innerHTML = '';//resetting the fields fromt the last 'load'

    contacts.forEach(function(contact, index) {
        let listItem = document.createElement('li');
        listItem.textContent = `${contact.name} - ${contact.phoneNumber} - ${contact.email} - ${contact.relation} - ${contact.notes}`;
        listElement.appendChild(listItem);
    });
  }

/*;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;                                        ;          Event Handlers            ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;*/

//Event listeners for form submission
  document.querySelector('form').addEventListener('submit', handleSubmit);
  //document.querySelector('form').addEventListener('delete', handleDelete);

  document.getElementById('deleteButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get the value from the input field
    let nameToDelete = document.getElementById('deleteName').value.trim();
    
    if (nameToDelete) {
      let deleteSuccessful = removeContactByName(nameToDelete);
      
      if (deleteSuccessful) {
        displayContacts(); // Assuming this function updates the UI
        alert(`Deleted contact with name: ${nameToDelete}`);
        document.getElementById('deleteName').value = ''; // Clear the input field
      } else {
        alert('No contact found with that name. Please try again.');
      }
    } else {
      alert('Please enter a name to delete.');
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Your existing code here
    document.getElementById('editForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        let originalName = document.getElementById('originalName').value;
        let updatedContact = {
            name: document.getElementById('editName').value.trim(),
            phoneNumber: document.getElementById('editPhoneNumber').value,
            email: document.getElementById('editEmail').value,
            relation: document.getElementById('editRelation').value,
            notes: document.getElementById('editNotes').value
        };

        if (updateContact(originalName, updatedContact)) {
          alert('Contact updated successfully!');
          document.getElementById('editForm').style.display = 'none';
          displayContacts();
        } 
        else {
            alert('Failed to update contact.');
        }        
    });

    // Add event listener for the update button
    document.getElementById('updateButton').addEventListener('click', function(event) {
        event.preventDefault();

        let nameToEdit = document.getElementById('updateName').value.trim();
        let contactToEdit = findContactByName(nameToEdit);
        
        console.log('Contact to edit:', contactToEdit); // Changed this log

        if (contactToEdit) {
            prefillEditForm(contactToEdit);
        } else {
            alert('Contact not found.');
        }
    });
});

//things due soon have a special way to show or notifications
//allow there to be recurrent items
//ability to do specific time tracking/logging