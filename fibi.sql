CREATE DATABASE IF NOT EXISTS Fibi;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20),
    last_active_at DATETIME,
    phone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS articles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content MEDIUMTEXT NOT NULL,
    created_at DATETIME
);

ALTER TABLE articles ADD author_id INT UNSIGNED NOT NULL AFTER id; 
ALTER TABLE articles ADD CONSTRAINT fk_articles_users_author_id FOREIGN KEY (author_id) REFERENCES users(id);

CREATE TABLE IF NOT EXISTS comments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(1000) NOT NULL,
    created_at DATETIME,
    last_updated_at DATETIME
);

ALTER TABLE comments ADD author_id INT UNSIGNED NOT NULL AFTER id; 
ALTER TABLE comments ADD CONSTRAINT fk_comments_users_author_id FOREIGN KEY (author_id) REFERENCES users(id);

ALTER TABLE comments ADD article_id INT UNSIGNED NOT NULL AFTER author_id; 
ALTER TABLE comments ADD CONSTRAINT fk_comments_article_id FOREIGN KEY (article_id) REFERENCES articles(id);

SELECT * from Fibi.users;
SELECT * from Fibi.articles;
SELECT * from Fibi.comments;

SELECT * from Fibi.comments WHERE id = 17;
DELETE FROM Fibi.articles WHERE id < 16;

INSERT INTO Fibi.comments (author_id, article_id, content, created_at, last_updated_at) VALUES (4, 17, "Testing content 3", null, null);

CREATE TABLE IF NOT EXISTS `news` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `source_id` varchar(50) DEFAULT NULL,
  `source_name` varchar(100) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `description` varchar(5000) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `date_published` datetime DEFAULT NULL,
  `content` mediumtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM news;

INSERT INTO news VALUES (
'1',
'The conversation', 
'The conversation', 
'Marcus Chung', 
'US colleges report a 43% decline in new international student enrollment', 
'For the fourth year in a row, the number of international students enrolled at U.S. colleges and universities has declined. This is according to data released this month by the State Department and the Institute of International Education.', 
'https://theconversation.com/us-colleges-report-a-43-decline-in-new-international-student-enrollment-and-not-just-because-of-the-pandemic-149885', 
'https://i1.wp.com/magazine.umbc.edu/wp-content/uploads/2020/11/New-convo.jpg?resize=1140%2C475&ssl=1', 
'2020-11-22 04:04:53', 
'For the fourth year in a row, the number of international students enrolled at U.S. colleges and universities has declined. This is according to data released this month by the State Department and the Institute of International Education.');

INSERT INTO news VALUES (
'2',
'Forbes', 
'Forbes', 
'Andy J. Semotiuk', 
'How To Become A U.S. Citizen', 
'If you have any kind of a degree, diploma or even an educational certificate, you will know that it takes more than an application to get one. ', 
'https://www.forbes.com/sites/andyjsemotiuk/2020/11/29/how-to-become-a-us-citizen/?sh=343ca317d8b7', 
'https://specials-images.forbesimg.com/imageserve/5fc2b15731ebfc249bf99b87/960x0.jpg?cropX1=250&cropX2=4992&cropY1=86&cropY2=3053', 
'2020-11-30 04:04:53', 
'If you have any kind of a degree, diploma or even an educational certificate, you will know that it takes more than an application to get one. ');

INSERT INTO news VALUES (
'3',
'WONDERLUST', 
'WONDERLUST', 
'By the editors', 
'THE MARRIAGE GREEN CARD WHAT DOES IT TAKE TO BRING A FIANCE TO THE USA?', 
'If you find love overseas and want to marry and live together in America, you need a special marriage green card. Here is the process', 
'https://wonderlusttravel.com/marriage-green-card-how-long-does-it-take-to-bring-a-spouse-to-the-usa/', 
'https://cdn10.phillymag.com/wp-content/uploads/sites/3/2020/03/secret-marriage.jpg', 
'2020-12-05 04:04:53', 
'If you find love overseas and want to marry and live together in America, you need a special marriage green card. Here is the process');

INSERT INTO news VALUES (
'4',
'STAT', 
'STAT', 
'Shraddha Chakradhar', 
'Getting into U.S. medical schools wasn’t easy for them. Now international students are smoothing the path for others', 
'Long before Azan Virji entered medical school, a college counselor back home in Tanzania tried to dissuade him from coming to the U.S. to pursue a medical degree. The odds, he was told, would not be in his favor. Fewer than 3% of medical school applicants in the U.S. are international students, and only 0.5% of all medical school enrollees are from abroad.', 
'https://www.statnews.com/2020/08/03/international-students-medical-school-mentor-network/', 
'https://www.statnews.com/wp-content/uploads/2020/07/072520_AzanVirji_01-1600x900.jpg', 
'2020-08-03 04:04:53', 
'Long before Azan Virji entered medical school, a college counselor back home in Tanzania tried to dissuade him from coming to the U.S. to pursue a medical degree. The odds, he was told, would not be in his favor. Fewer than 3% of medical school applicants in the U.S. are international students, and only 0.5% of all medical school enrollees are from abroad.');

INSERT INTO news VALUES (
'5',
'National Law Review', 
'National Law Review', 
'Jackson Lewsi', 
'DHS Arrests 15 Individuals on OPT, Continues High Scrutiny of Foreign Students, Warns University DSOs', 
'The Department of Homeland Security (DHS) has announced the arrest of 15 individuals who claimed to work on Optional Practical Training (OPT) for nonexistent companies.  In addition, USCIS notified 700 OPT recipients suspected of being complicit in similar activities that it would revoke their employment authorization. ', 
'https://www.natlawreview.com/article/dhs-arrests-15-individuals-opt-continues-high-scrutiny-foreign-students-warns', 
'https://i.insider.com/5f90be38abcd0c0018d68f51?width=1100&format=jpeg&auto=webp', 
'2020-11-11 04:04:53', 
'The Department of Homeland Security (DHS) has announced the arrest of 15 individuals who claimed to work on Optional Practical Training (OPT) for nonexistent companies.  In addition, USCIS notified 700 OPT recipients suspected of being complicit in similar activities that it would revoke their employment authorization. ');

INSERT INTO news VALUES (
'6',
'Business Standard', 
'Business Standard', 
'Shraddha Chakradhar', 
'Senate passes bill stamping cap for work-based visas', 
'The US Senate has unanimously passed a bill that eliminates the per-country numerical limitation for employment-based immigrant visas and raises it for family-based visas, a legislation that will hugely benefit hundreds of thousands of Indian professionals in America who have been waiting for years to get their green cards.', 
'https://www.business-standard.com/article/pti-stories/us-senate-passes-bill-eliminating-per-country-cap-for-employment-based-immigrant-visas-120120300266_1.html', 
'https://bsmedia.business-standard.com/_media/bs/img/article/2020-10/08/full/1602097643-2819.jpg', 
'2020-12-05 04:04:53', 
'The US Senate has unanimously passed a bill that eliminates the per-country numerical limitation for employment-based immigrant visas and raises it for family-based visas, a legislation that will hugely benefit hundreds of thousands of Indian professionals in America who have been waiting for years to get their green cards.');

INSERT INTO news VALUES (
'7',
'techcrunch', 
'techcrunch', 
'Sophie Alcorn', 
'Dear Sophie: How can I speed up getting a green card?', 
'Here’s another edition of “Dear Sophie,” the advice column that answers immigration-related questions about working at technology companies. “Your questions are vital to the spread of knowledge that allows people all over the world to rise above borders and pursue their dreams,” says Sophie Alcorn, a Silicon Valley immigration attorney. ', 
'https://techcrunch.com/2020/07/29/dear-sophie-how-can-i-speed-up-getting-a-green-card/', 
'https://techcrunch.com/wp-content/uploads/2020/06/SA-at-TC.jpg?w=730&crop=1', 
'2020-07-29 04:04:53', 
'Here’s another edition of “Dear Sophie,” the advice column that answers immigration-related questions about working at technology companies. “Your questions are vital to the spread of knowledge that allows people all over the world to rise above borders and pursue their dreams,” says Sophie Alcorn, a Silicon Valley immigration attorney. ');

INSERT INTO news VALUES (
'8',
'Forbes', 
'Forbes', 
'Stuart Anderson', 
'Judge Saves OPT For International Students', 
'In a victory for employers, universities and international students, a lawsuit aimed at preventing foreign students from working on Optional Practical Training (OPT) is over.', 
'https://www.forbes.com/sites/stuartanderson/2020/12/01/judges-order-will-save-opt-for-international-students/?sh=468ead1469f1', 
'https://specials-images.forbesimg.com/imageserve/5fc5cedda0af0bbf24f81f51/960x0.jpg?fit=scale', 
'2020-12-05 04:04:53', 
'In a victory for employers, universities and international students, a lawsuit aimed at preventing foreign students from working on Optional Practical Training (OPT) is over.');
