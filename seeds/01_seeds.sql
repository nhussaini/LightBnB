INSERT INTO users (name, email, password) 
VALUES ('ALex Morgan','morgan@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Bob Maclean', 'bob@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Steven Frey', 'steven@gmail.com', ' $2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, const_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active, owner_id)
VALUES('LuxHouse', 'beautiful house', 'www.yyy.com', 'www.yui.com', 2000, 5, 2, 4, 'Canada', 'Billing Cres', 'Toronto', 'ON','M2G 567', true, 1),
('ExtraOrd', 'large and beautiful house', 'www.cbn.com', 'www.abn.com', 2000, 5, 2, 4, 'Canada', 'Billing Cres', 'Toronto', 'ON','M2G 567', true, 1),
('Habit mix', 'description', 'www.cbn.com', 'www.abn.com', 2000, 5, 2, 4, 'Canada', 'Billing Cres', 'Toronto', 'ON','M2G 567', true, 2);



INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 4, 'message' ),
 (2, 1, 3, 5, 'message' ),
 (3, 3, 3, 7, 'message' );