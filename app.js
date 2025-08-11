import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    let currentUser;
    let currentUserData;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            const userDbRef = ref(db, 'users/' + user.uid);
            get(userDbRef).then((snapshot) => {
                if (snapshot.exists()) {
                    currentUserData = snapshot.val();
                    populateProfileData(currentUserData);
                } else {
                    console.log("No data available for this user.");
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            window.location.href = 'portal.html';
        }
    });

    function populateProfileData(userData) {
        // This function now only populates the view-mode elements
        const setText = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || '';
            }
        };

        const profilePictureElement = document.getElementById('profile-picture');
        if (profilePictureElement && userData.profilePictureURL) {
            profilePictureElement.src = userData.profilePictureURL;
        }

        setText('user-name', userData.displayName);
        setText('user-email', userData.email);
        setText('user-age', userData.age);
        setText('user-program', userData.programOfInterest);
        setText('user-dob', userData.dob);
        setText('user-gender', userData.gender);
        setText('user-phone', userData.phone);

        if (userData.address) {
            const address = `${userData.address.street}, ${userData.address.city}, ${userData.address.state} ${userData.address.zip}, ${userData.address.country}`;
            setText('user-address', address);
        }

        if (userData.academicBackground) {
            setText('user-prev-education', userData.academicBackground.previousEducation);
        }

        if (userData.program) {
            setText('user-degree', userData.program.degree);
            setText('user-major', userData.program.major);
            setText('user-minor', userData.program.minor);
        }

        if (userData.emergencyContact) {
            setText('user-emergency-name', userData.emergencyContact.name);
            setText('user-emergency-relationship', userData.emergencyContact.relationship);
            setText('user-emergency-phone', userData.emergencyContact.phone);
        }
    }

    function toggleEditMode(isEditing) {
        const viewElements = document.querySelectorAll('.view-mode');
        const editElements = document.querySelectorAll('.edit-mode');

        if (isEditing) {
            // Populate input fields with current data
            document.getElementById('edit-user-name').value = currentUserData.displayName || '';
            document.getElementById('edit-user-age').value = currentUserData.age || '';
            document.getElementById('edit-user-program').value = currentUserData.programOfInterest || '';
            document.getElementById('edit-user-dob').value = currentUserData.dob || '';
            document.getElementById('edit-user-gender').value = currentUserData.gender || '';
            document.getElementById('edit-user-phone').value = currentUserData.phone || '';
            document.getElementById('edit-user-address').value = currentUserData.address ? `${currentUserData.address.street}, ${currentUserData.address.city}, ${currentUserData.address.state} ${currentUserData.address.zip}, ${currentUserData.address.country}` : '';
            document.getElementById('edit-user-prev-education').value = currentUserData.academicBackground ? currentUserData.academicBackground.previousEducation : '';
            document.getElementById('edit-user-degree').value = currentUserData.program ? currentUserData.program.degree : '';
            document.getElementById('edit-user-major').value = currentUserData.program ? currentUserData.program.major : '';
            document.getElementById('edit-user-minor').value = currentUserData.program ? currentUserData.program.minor : '';
            document.getElementById('edit-user-emergency-name').value = currentUserData.emergencyContact ? currentUserData.emergencyContact.name : '';
            document.getElementById('edit-user-emergency-relationship').value = currentUserData.emergencyContact ? currentUserData.emergencyContact.relationship : '';
            document.getElementById('edit-user-emergency-phone').value = currentUserData.emergencyContact ? currentUserData.emergencyContact.phone : '';

            viewElements.forEach(el => el.classList.add('hidden'));
            editElements.forEach(el => el.classList.remove('hidden'));
            editProfileBtn.classList.add('hidden');
            saveProfileBtn.classList.remove('hidden');
        } else {
            viewElements.forEach(el => el.classList.remove('hidden'));
            editElements.forEach(el => el.classList.add('hidden'));
            editProfileBtn.classList.remove('hidden');
            saveProfileBtn.classList.add('hidden');
        }
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            toggleEditMode(true);
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const updates = {
                displayName: document.getElementById('edit-user-name').value,
            age: document.getElementById('edit-user-age').value,
            programOfInterest: document.getElementById('edit-user-program').value,
            dob: document.getElementById('edit-user-dob').value,
            gender: document.getElementById('edit-user-gender').value,
            phone: document.getElementById('edit-user-phone').value,
            // Note: address needs to be parsed back into an object if we want to save it structured.
            // For simplicity here, we are not handling address edits. A more robust solution would be needed.
            'program/degree': document.getElementById('edit-user-degree').value,
            'program/major': document.getElementById('edit-user-major').value,
            'program/minor': document.getElementById('edit-user-minor').value,
            'academicBackground/previousEducation': document.getElementById('edit-user-prev-education').value,
            'emergencyContact/name': document.getElementById('edit-user-emergency-name').value,
            'emergencyContact/relationship': document.getElementById('edit-user-emergency-relationship').value,
            'emergencyContact/phone': document.getElementById('edit-user-emergency-phone').value,
        };

        const userDbRef = ref(db, 'users/' + currentUser.uid);
        update(userDbRef, updates)
            .then(() => {
                // Re-fetch data to update the view
                get(userDbRef).then((snapshot) => {
                    currentUserData = snapshot.val();
                    populateProfileData(currentUserData);
                    toggleEditMode(false);
                    alert('Profile updated successfully!');
                });
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                alert('Failed to update profile.');
            });
    });
});
