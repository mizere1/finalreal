import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { ref as dbRef, get, set } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const portalContainer = document.querySelector('.portal-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutButton = document.getElementById('logout-button');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in.
            authSection.style.display = 'none';
            portalContainer.style.display = 'flex';

            const userDbRef = dbRef(db, 'users/' + user.uid);
            get(userDbRef).then((snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    const profilePictureEl = document.getElementById('profile-picture');
                    if (profilePictureEl) {
                        profilePictureEl.src = userData.profilePictureURL || '#';
                    }
                    const userNameEl = document.getElementById('user-name');
                    if (userNameEl) {
                        userNameEl.textContent = userData.displayName || 'N/A';
                    }
                    const userEmailEl = document.getElementById('user-email');
                    if (userEmailEl) {
                        userEmailEl.textContent = userData.email || 'N/A';
                    }
                }
            });

            logoutButton.addEventListener('click', () => {
                signOut(auth).then(() => {
                    // Sign-out successful.
                }).catch((error) => {
                    console.error('Logout error:', error);
                });
            });

        } else {
            // User is signed out.
            authSection.style.display = 'block';
            portalContainer.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
            });
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = signupForm['signup-name'].value;
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        const age = signupForm['signup-age'].value;
        const programOfInterest = signupForm['signup-program'].value;
        const profilePictureFile = signupForm['signup-profile-picture'].files[0];

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                let profilePictureURL = ''; // Default empty URL

                // Upload profile picture if a file was selected
                if (profilePictureFile) {
                    const pictureRef = storageRef(storage, `profile_pictures/${user.uid}`);
                    uploadBytes(pictureRef, profilePictureFile)
                        .then((snapshot) => {
                            return getDownloadURL(snapshot.ref);
                        })
                        .then((downloadURL) => {
                            profilePictureURL = downloadURL;
                            // Now save user data with the picture URL
                            saveUserData(user, name, email, age, programOfInterest, profilePictureURL);
                        })
                        .catch((error) => {
                            console.error("Error uploading profile picture: ", error);
                            // Still save user data, but without the picture URL
                            saveUserData(user, name, email, age, programOfInterest, '');
                        });
                } else {
                    // Save user data without a profile picture
                    saveUserData(user, name, email, age, programOfInterest, '');
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
                const authError = document.getElementById('auth-error');
                if (authError) {
                    authError.textContent = errorMessage;
                }
            });
    });

    function saveUserData(user, name, email, age, programOfInterest, profilePictureURL) {
        const userDbRef = dbRef(db, 'users/' + user.uid);
        set(userDbRef, {
            displayName: name,
            email: email,
            role: 'student',
            age: age,
            programOfInterest: programOfInterest,
            profilePictureURL: profilePictureURL
        }).catch((error) => {
            console.error("Error saving user data: ", error);
        });
    }
});
