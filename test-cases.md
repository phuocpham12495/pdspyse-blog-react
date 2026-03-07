## [TC-001] Verify homepage displays paginated list of articles
**Preconditions:** At least 10 articles exist in the database to trigger pagination.

**Steps:**
1. Open the application homepage.

**Expected Result:** A list of articles is displayed. If more than a page's worth, pagination controls are visible, and only the first page's articles are shown initially.

---

## [TC-002] Verify each article entry includes thumbnail, title, and category
**Preconditions:** Articles with thumbnails, titles, and categories exist in the database.

**Steps:**
1. Open the application homepage.
2. Observe the displayed article entries.

**Expected Result:** Each article entry clearly shows a thumbnail image, the article title, and its associated category.

---

## [TC-003] Verify unauthenticated users can view article list
**Preconditions:** User is not logged in.

**Steps:**
1. Open the application homepage.

**Expected Result:** The article list is displayed without requiring any login or authentication.

---

## [TC-004] Verify clicking an article navigates to its detail page
**Preconditions:** The homepage displays a list of articles.

**Steps:**
1. Open the application homepage.
2. Click on the title or thumbnail of any article.

**Expected Result:** The browser navigates to the detailed view page of the selected article.

---

## [TC-005] Verify article detail page displays full content, title, thumbnail, and publication date
**Preconditions:** An article detail page is open.

**Steps:**
1. Navigate to an article's detail page (e.g., by clicking from the homepage).
2. Observe the content of the page.

**Expected Result:** The page displays the full article content, its title, the associated thumbnail, and the publication date.

---

## [TC-006] Verify unauthenticated users can view article details
**Preconditions:** User is not logged in.

**Steps:**
1. Navigate directly to an article's detail page URL (if known) or click on an article from the homepage.

**Expected Result:** The article's full content and details are displayed without requiring any login or authentication.

---

## [TC-007] Verify search bar is accessible on article list page
**Preconditions:** None.

**Steps:**
1. Open the application homepage.

**Expected Result:** A search bar or input field is clearly visible and accessible on the page.

---

## [TC-008] Search for articles by keyword in title (matching results)
**Preconditions:** Articles with known keywords in their titles exist.

**Steps:**
1. Open the application homepage.
2. Enter a keyword (e.g., 'React') that matches an article title into the search bar.
3. Submit the search (e.g., by pressing Enter or clicking a search button).

**Expected Result:** The article list updates to show only articles whose titles contain the keyword 'React'. Pagination (if present) should reflect the filtered results.

---

## [TC-009] Search for articles by keyword in content (matching results)
**Preconditions:** Articles with known keywords in their content exist (but not necessarily in the title).

**Steps:**
1. Open the application homepage.
2. Enter a keyword (e.g., 'frontend') that matches an article's content into the search bar.
3. Submit the search.

**Expected Result:** The article list updates to show only articles whose content contains the keyword 'frontend'. Pagination (if present) should reflect the filtered results.

---

## [TC-010] Search for articles with no matching results
**Preconditions:** None.

**Steps:**
1. Open the application homepage.
2. Enter a non-existent keyword (e.g., 'xyz123abc') into the search bar.
3. Submit the search.

**Expected Result:** The article list displays a message indicating 'No articles found' or similar, and no articles are shown.

---

## [TC-011] Search with an empty keyword
**Preconditions:** None.

**Steps:**
1. Open the application homepage.
2. Ensure the search bar is empty.
3. Submit the search (e.g., by clicking the search button or pressing Enter if it triggers a search).

**Expected Result:** The article list should revert to showing all articles (or the initial paginated list) as if no search filter was applied.

---

## [TC-012] Search with special characters
**Preconditions:** None.

**Steps:**
1. Open the application homepage.
2. Enter special characters (e.g., '!@#$') into the search bar.
3. Submit the search.

**Expected Result:** The application handles the special characters gracefully. Either no results are found, or if articles contain such characters, they are returned. No errors or crashes should occur.

---

## [TC-013] Verify category filter is available on article list page
**Preconditions:** None.

**Steps:**
1. Open the application homepage.

**Expected Result:** A category filter (e.g., a dropdown, a list of tags, or sidebar menu) is visible and accessible.

---

## [TC-014] Filter articles by an existing category
**Preconditions:** Multiple articles across different categories exist. At least one article exists in the 'Technology' category.

**Steps:**
1. Open the application homepage.
2. Select an existing category (e.g., 'Technology') from the category filter.

**Expected Result:** The article list instantly updates to display only articles tagged with the 'Technology' category. Pagination (if present) should reflect the filtered results.

---

## [TC-015] Filter by a category with no articles
**Preconditions:** A category exists that currently has no articles associated with it (e.g., 'Vacation').

**Steps:**
1. Open the application homepage.
2. Select the category 'Vacation' from the category filter.

**Expected Result:** The article list displays a message indicating 'No articles found in this category' or similar, and no articles are shown.

---

## [TC-016] Clear category filter
**Preconditions:** The article list is currently filtered by a category.

**Steps:**
1. Open the application homepage and filter by a category.
2. Locate the option to clear or reset the category filter (e.g., 'All Categories' option or a clear button).

**Expected Result:** The article list reverts to showing all articles across all categories (or the initial paginated list) as if no category filter was applied.

---

## [TC-017] Register a new admin account with valid credentials
**Preconditions:** Application registration page is accessible. Email is not already registered.

**Steps:**
1. Navigate to the registration page.
2. Enter a unique valid email address (e.g., 'testadmin@example.com').
3. Enter a strong password.
4. Confirm the password.
5. Click the 'Register' or 'Sign Up' button.

**Expected Result:** The user account is created. Depending on Supabase settings, a confirmation message might appear, and an email verification might be sent, or the user is immediately logged in and redirected.

---

## [TC-018] Log in with valid admin credentials
**Preconditions:** An admin account (e.g., 'admin@example.com' with password 'password123') is registered and confirmed.

**Steps:**
1. Navigate to the login page.
2. Enter the registered admin email ('admin@example.com').
3. Enter the correct password ('password123').
4. Click the 'Log In' button.

**Expected Result:** The user is successfully logged in and redirected to the admin dashboard.

---

## [TC-019] Attempt to log in with invalid email or password
**Preconditions:** None.

**Steps:**
1. Navigate to the login page.
2. Enter an unregistered email or a valid email with an incorrect password.
3. Click the 'Log In' button.

**Expected Result:** An error message indicating 'Invalid credentials' or similar appears. The user remains on the login page.

---

## [TC-020] Verify redirection to admin dashboard after successful login
**Preconditions:** An admin account is registered.

**Steps:**
1. Navigate to the login page.
2. Log in with valid admin credentials.

**Expected Result:** After successful login, the application redirects the user to the designated admin dashboard page.

---

## [TC-021] Verify Supabase Auth handling of password reset (optional)
**Preconditions:** An admin account is registered.

**Steps:**
1. Navigate to the login page.
2. Click on 'Forgot Password' link.
3. Enter registered admin email.
4. Check email for reset link and follow it.
5. Enter new password and confirm.
6. Attempt to login with new password.

**Expected Result:** Password reset email is received. User can successfully reset password and log in with new credentials.

---

## [TC-022] Verify access to article creation form from admin dashboard
**Preconditions:** Admin user is logged in.

**Steps:**
1. Log in as an admin user.
2. Navigate to the admin dashboard.
3. Look for an option to 'Create New Article' or similar.

**Expected Result:** A button or link labeled 'Create New Article' (or similar) is present and, upon clicking, navigates to the article creation form.

---

## [TC-023] Create a new article with all valid fields (title, content, category, thumbnail)
**Preconditions:** Admin user is logged in. Article creation form is open.

**Steps:**
1. Navigate to the article creation form.
2. Enter a unique title for the new article.
3. Input rich text content into the content editor.
4. Select an existing category from the dropdown/selector.
5. Upload a valid thumbnail image file (e.g., JPEG, PNG).
6. Click the 'Publish' or 'Save Article' button.

**Expected Result:** A success message is displayed. The new article is saved and appears in the admin's list of articles. It should also be immediately visible on the public homepage.

---

## [TC-024] Verify new article is visible to public users
**Preconditions:** A new article has been created by an admin.

**Steps:**
1. Log in as an admin user, create an article.
2. Log out, or open a new incognito window.
3. Navigate to the application homepage.

**Expected Result:** The newly created article appears in the paginated list on the public homepage. Clicking on it reveals its full content.

---

## [TC-025] Attempt to access article creation form as an unauthenticated user (negative)
**Preconditions:** User is not logged in.

**Steps:**
1. Attempt to directly navigate to the URL of the article creation form (if known) or try to find a 'Create Article' option.

**Expected Result:** The user is redirected to the login page or receives an 'Access Denied' message. The article creation form is not displayed.

---

## [TC-026] Attempt to create an article with missing required fields (negative)
**Preconditions:** Admin user is logged in. Article creation form is open.

**Steps:**
1. Navigate to the article creation form.
2. Leave the 'Title' field empty.
3. Enter valid content and select a category.
4. Click the 'Publish' or 'Save Article' button.

**Expected Result:** An error message appears indicating that the 'Title' field is required. The article is not saved.

---

## [TC-027] Verify admin can view a list of their articles in the admin dashboard
**Preconditions:** Admin user is logged in. At least one article has been created by this admin.

**Steps:**
1. Log in as an admin user.
2. Navigate to the admin dashboard.

**Expected Result:** A list or table of articles managed by this admin user is displayed, typically with options to edit or delete each article.

---

## [TC-028] Edit article title and content
**Preconditions:** Admin user is logged in. An existing article is available for editing.

**Steps:**
1. Navigate to the admin dashboard and select an article to edit.
2. Modify the 'Title' field.
3. Modify the 'Content' field with new text.
4. Click the 'Save Changes' or 'Update Article' button.

**Expected Result:** A success message is displayed. The article's title and content are updated in the admin's view and are reflected immediately on the public article detail page and list.

---

## [TC-029] Edit article category
**Preconditions:** Admin user is logged in. An existing article is available for editing.

**Steps:**
1. Navigate to the admin dashboard and select an article to edit.
2. Change the selected 'Category' to a different one.
3. Click the 'Save Changes' or 'Update Article' button.

**Expected Result:** A success message is displayed. The article's category is updated in the admin's view and is reflected immediately on the public article detail page and list.

---

## [TC-030] Edit article thumbnail
**Preconditions:** Admin user is logged in. An existing article is available for editing.

**Steps:**
1. Navigate to the admin dashboard and select an article to edit.
2. Locate the thumbnail upload section.
3. Upload a new valid image file to replace the existing thumbnail.
4. Click the 'Save Changes' or 'Update Article' button.

**Expected Result:** A success message is displayed. The article's thumbnail is updated in the admin's view and is reflected immediately on the public article list and detail page.

---

## [TC-031] Verify updated article is visible publicly
**Preconditions:** An admin has successfully edited an article.

**Steps:**
1. Log out or open a new incognito window.
2. Navigate to the public article list.
3. Find the edited article and navigate to its detail page.

**Expected Result:** The public view of the article (both in the list and detail page) reflects all the changes made by the admin (title, content, category, thumbnail).

---

## [TC-032] Attempt to access article edit form as an unauthenticated user (negative)
**Preconditions:** User is not logged in.

**Steps:**
1. Attempt to directly navigate to the URL of an article edit form (if known).

**Expected Result:** The user is redirected to the login page or receives an 'Access Denied' message. The article edit form is not displayed.

---

## [TC-033] Select an article for deletion and confirm
**Preconditions:** Admin user is logged in. An existing article is available for deletion.

**Steps:**
1. Log in as an admin.
2. Navigate to the admin dashboard and locate an article.
3. Click the 'Delete' button associated with the article.
4. In the confirmation dialog, click 'Confirm' or 'Delete'.

**Expected Result:** A success message is displayed. The article is removed from the admin's list. The confirmation dialog closes.

---

## [TC-034] Verify article is removed from public view after deletion
**Preconditions:** An admin has successfully deleted an article.

**Steps:**
1. Log out or open a new incognito window.
2. Navigate to the public article list and search for the deleted article by its previous title.
3. If the article was on the first page, verify it's no longer present.

**Expected Result:** The deleted article is no longer visible on the public article list or its detail page (if attempted to access directly).

---

## [TC-035] Select an article for deletion and cancel
**Preconditions:** Admin user is logged in. An existing article is available for deletion.

**Steps:**
1. Log in as an admin.
2. Navigate to the admin dashboard and locate an article.
3. Click the 'Delete' button associated with the article.
4. In the confirmation dialog, click 'Cancel'.

**Expected Result:** The article remains in the admin's list. The confirmation dialog closes, and no changes are made to the article's status or its public visibility.

---

## [TC-036] Attempt to delete an article as an unauthenticated user (negative)
**Preconditions:** User is not logged in.

**Steps:**
1. Attempt to access a deletion endpoint or function directly (if discoverable).

**Expected Result:** The action is denied. The user is redirected to the login page or receives an 'Access Denied' error. The article is not deleted.

---

## [TC-037] Upload a valid image during article creation/edit
**Preconditions:** Admin user is logged in. Article creation/edit form is open.

**Steps:**
1. Navigate to article creation/edit form.
2. Locate the thumbnail upload input.
3. Click to select a file and choose a valid image file (e.g., small JPEG, PNG).
4. Complete other required fields.
5. Submit the form.

**Expected Result:** The image is successfully uploaded, associated with the article, and the article is saved/updated. A preview of the thumbnail might be shown in the form.

---

## [TC-038] Verify uploaded thumbnail is displayed correctly
**Preconditions:** An article has been created/edited with a valid thumbnail uploaded.

**Steps:**
1. Navigate to the public article list.
2. Navigate to the article's detail page.

**Expected Result:** The uploaded thumbnail image is displayed correctly in the article list entry and prominently on the article detail page.

---

## [TC-039] Attempt to upload an invalid image file type (negative)
**Preconditions:** Admin user is logged in. Article creation/edit form is open.

**Steps:**
1. Navigate to article creation/edit form.
2. Locate the thumbnail upload input.
3. Click to select a file and choose an invalid file type (e.g., a '.pdf' or '.txt' file).
4. Attempt to submit the form or observe immediate validation.

**Expected Result:** An error message appears (e.g., 'Invalid file type. Only images are allowed.') and the file is not uploaded. The form prevents submission until a valid file type is chosen.

---

## [TC-040] Attempt to upload an image exceeding size limit (negative)
**Preconditions:** Admin user is logged in. Article creation/edit form is open. A large image file (e.g., > 5MB) is available.

**Steps:**
1. Navigate to article creation/edit form.
2. Locate the thumbnail upload input.
3. Click to select a file and choose a large image file that exceeds the configured size limit.
4. Attempt to submit the form or observe immediate validation.

**Expected Result:** An error message appears (e.g., 'Image size exceeds limit.') and the file is not uploaded. The form prevents submission until a valid file size is chosen.

---

## [TC-041] Verify image stored in Supabase Storage (Integration Test)
**Preconditions:** Admin user is logged in. An article with a thumbnail has been successfully created.

**Steps:**
1. After creating an article with a thumbnail, access the Supabase dashboard directly (or use Supabase CLI/API).
2. Navigate to the Storage section and locate the bucket used for thumbnails.
3. Verify the uploaded image file exists in the storage bucket with the correct naming/path convention.

**Expected Result:** The image file for the article's thumbnail is found in the designated Supabase Storage bucket.

---

## [TC-042] Verify access to profile section for admin users
**Preconditions:** Admin user is logged in.

**Steps:**
1. Log in as an admin user.
2. Navigate to the admin dashboard.
3. Look for a 'Profile' or 'Account Settings' link/button.

**Expected Result:** A 'Profile' or 'Account Settings' section is accessible from the admin dashboard, leading to a page where profile details can be viewed/edited.

---

## [TC-043] Update avatar image in profile settings
**Preconditions:** Admin user is logged in. Profile section is open.

**Steps:**
1. Navigate to the profile settings page.
2. Locate the avatar upload option.
3. Upload a new valid image file for the avatar.
4. Click 'Save Changes'.

**Expected Result:** A success message is displayed. The new avatar image is displayed in the profile section and reflected wherever the user's avatar is shown (e.g., admin dashboard, comments if applicable).

---

## [TC-044] Update email address in profile settings
**Preconditions:** Admin user is logged in. Profile section is open.

**Steps:**
1. Navigate to the profile settings page.
2. Modify the 'Email' field to a new, valid, and unregistered email address.
3. Click 'Save Changes'.

**Expected Result:** A success message is displayed, indicating that the email update requires verification. An email is sent to the new address. Upon verification, the email is updated in the system.

---

## [TC-045] Update date of birth in profile settings
**Preconditions:** Admin user is logged in. Profile section is open.

**Steps:**
1. Navigate to the profile settings page.
2. Modify the 'Date of Birth' field.
3. Click 'Save Changes'.

**Expected Result:** A success message is displayed. The date of birth is updated in the profile section and reflected across the application where this information is displayed (if applicable).

---

## [TC-046] Verify profile changes are reflected across the application
**Preconditions:** Admin user has updated profile details (e.g., avatar, email, date of birth).

**Steps:**
1. After updating profile details, navigate to different parts of the application (e.g., admin dashboard, any pages displaying user info).
2. Log out and log back in, then check profile section again.

**Expected Result:** All saved profile changes (avatar, email, date of birth) are consistently reflected in all relevant parts of the application and persist across sessions.

---

## [TC-047] Attempt to manage profile settings as an unauthenticated user (negative)
**Preconditions:** User is not logged in.

**Steps:**
1. Attempt to directly navigate to the URL of the profile settings page (if known).

**Expected Result:** The user is redirected to the login page or receives an 'Access Denied' message. Profile settings are not displayed.

---

## [TC-048] Verify article list responsiveness on different screen sizes
**Preconditions:** Application homepage is open.

**Steps:**
1. Open the application homepage on a desktop browser.
2. Resize the browser window to simulate tablet screen sizes (e.g., 768px - 1024px width).
3. Resize the browser window to simulate mobile screen sizes (e.g., < 768px width).
4. Access the site directly on a tablet and a mobile device if possible.

**Expected Result:** The article list layout adapts gracefully. Articles reflow, columns adjust, and pagination/filter elements remain functional without horizontal scrolling on any device size.

---

## [TC-049] Verify article detail page responsiveness
**Preconditions:** An article detail page is open.

**Steps:**
1. Open an article detail page on a desktop browser.
2. Resize the browser window to simulate tablet screen sizes.
3. Resize the browser window to simulate mobile screen sizes.
4. Access the article detail page directly on a tablet and a mobile device.

**Expected Result:** The article's title, content, thumbnail, and other elements on the detail page adapt gracefully to different screen sizes, ensuring readability and usability without horizontal scrolling.

---

## [TC-050] Verify admin dashboard and forms responsiveness
**Preconditions:** Admin user is logged in. Admin dashboard or an article creation/edit form is open.

**Steps:**
1. Log in as admin and navigate to the dashboard.
2. Open an article creation/edit form.
3. Resize the browser window to simulate tablet and mobile screen sizes.
4. Access these pages directly on a tablet and a mobile device.

**Expected Result:** The admin dashboard, its navigation, and all forms (e.g., article creation, profile settings) adapt gracefully, allowing full functionality and usability on all tested screen sizes without horizontal scrolling.

---

## [TC-051] Verify interactive elements remain easily tappable/clickable on mobile devices
**Preconditions:** Application is accessed on a mobile device or a browser emulating a mobile device.

**Steps:**
1. Navigate through various pages (homepage, article detail, login, admin dashboard, forms).
2. Interact with all buttons, links, search bars, filter dropdowns, and form inputs.

**Expected Result:** All interactive elements are sufficiently sized and spaced, making them easy to tap or click accurately on mobile touchscreens without accidental activation of adjacent elements.

---

## [TC-052] Verify PWA installation prompt/capability
**Preconditions:** Browser supports PWA installation (e.g., Chrome on Android/Desktop, Safari on iOS).

**Steps:**
1. Open the application homepage in a compatible browser.
2. Observe the browser UI.

**Expected Result:** The browser presents an 'Add to Home Screen' or 'Install App' prompt/icon, indicating PWA installability.

---

## [TC-053] Verify application loads quickly due to efficient caching
**Preconditions:** Application has been visited at least once to cache resources.

**Steps:**
1. Open the application for the first time.
2. Close the application and then reopen it.
3. Perform several navigations within the app.

**Expected Result:** Subsequent loads and navigations within the application are noticeably faster than the initial load, indicating effective caching of assets and content.

---

## [TC-054] Verify offline access to basic content (app shell, cached article lists)
**Preconditions:** Application has been installed as a PWA or visited recently to allow caching.

**Steps:**
1. Open the application while online.
2. Navigate to the homepage and browse a few articles to ensure they are cached.
3. Disconnect from the internet (e.g., turn off Wi-Fi/data, enable airplane mode).
4. Close the application (if installed) or the browser tab, then reopen it.
5. Attempt to navigate the homepage.

**Expected Result:** The application shell (header, navigation) loads. The previously viewed article list is displayed, or at least a graceful offline message is shown while allowing navigation to cached content.

---

## [TC-055] Verify offline access to article details (if previously cached)
**Preconditions:** Application has been installed as a PWA. At least one article detail page has been visited while online.

**Steps:**
1. Open the application while online and navigate to an article's detail page.
2. Disconnect from the internet.
3. Attempt to access the same article's detail page (e.g., via a direct link or by navigating from the cached homepage list).

**Expected Result:** The article's full content, title, and thumbnail are displayed even without an internet connection, demonstrating successful caching of specific content.