import { test, expect} from '@playwright/test'
import { annotateTest } from '../utils/annotate';
import  AddItemPage from '../logic/AdminAddItemPage'

test.use({ storageState: 'auth.json' });
let addItemPage : AddItemPage
test.beforeEach(async ({ page })=>{
  addItemPage = new AddItemPage(page);
  await addItemPage.navigate();
  //await page.waitForLoadState('networkidle')
})

test('should show access denied message for non-admin', async ({ page }) => {
  annotateTest({ feature: 'AdminAddItemNoAccess' });
  await expect(addItemPage.getAccessDeniedMessage()).toBeVisible({ timeout: 5000 });
});