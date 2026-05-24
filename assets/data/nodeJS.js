const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'members_fallback.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
let updated = 0;
for (const member of data) {
    if (!member.profile_photo || member.profile_photo.trim() === '') {
        member.profile_photo = `members/${member.id}.webp`;
        updated++;
    }
}
fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
console.log(`Updated ${updated} members with empty profile_photo (total: ${data.length})`);