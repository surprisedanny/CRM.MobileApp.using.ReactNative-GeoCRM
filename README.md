#Troubleshoot
#When Uncategorise error
nvm alias default system

# uninstalled package
-@react-native-community/datetimepicker
@react-native-picker/picker

1. Stock List -> GET  /stockmodule/stock-list
2. Movements List ->GET  /stockmodule/movements-list?page_nr=0
3. Returns List -> GET  /stockmodule/returns-list
4. Add Stock field options -> GET  /stockmodule/stock-field-data?action=add_stock
5. Add Stock Submit  ->  POST /stockmodule/add-stock
6. Location Devices -> GET  /locations/location-devices?location_id=1354
7. Transfer User dropdown -> GET   /stockmodule/users
8. POST stockmodule/sell-to-trader
9. POST stockmodule/swop-at-trader
10. POST stockmodule/transfer
11. POST stockmodule/return-device
12. POST stockmodule/return-to-warehouse

# how to generate release apk and aab file
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle 
--assets-dest android/app/src/main/res/

cd android

./gradlew assembleRelease
./gradlew bundleRelease


# check sqlite file
adb shell runs the shell
in shell run:
adb shell
run-as package-name(com.geoverse_app_rn)
cat filename.db > /sdcard/filename.db
exist shell session (Ctrl  + D)
adb pull /sdcard/filename.db

adb pull /sdcard/filename.db

online view link
https://sqliteviewer.app/#/maindb.db/table/locations_custom_master_field_data/



# Resolve Error in project build
 1. Could not resolve project :react-native-hms-availability.
    Replace the hmscore library manually