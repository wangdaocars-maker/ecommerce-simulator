-- CreateTable
CREATE TABLE "ProductGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductToGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    CONSTRAINT "ProductToGroup_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductToGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ProductGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "folder" TEXT NOT NULL DEFAULT '未分组',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "level" INTEGER NOT NULL DEFAULT 1,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "id", "level", "name", "parentId") SELECT "createdAt", "id", "level", "name", "parentId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
CREATE INDEX "Category_level_idx" ON "Category"("level");
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER,
    "countries" TEXT NOT NULL DEFAULT '[]',
    "countryTitles" TEXT NOT NULL DEFAULT '{}',
    "countryImages" TEXT NOT NULL DEFAULT '{}',
    "language" TEXT NOT NULL DEFAULT 'zh',
    "brand" TEXT,
    "model" TEXT,
    "keywords" TEXT,
    "price" REAL NOT NULL,
    "comparePrice" REAL,
    "stock" INTEGER NOT NULL,
    "sku" TEXT,
    "minUnit" TEXT NOT NULL DEFAULT 'piece',
    "salesMethod" TEXT NOT NULL DEFAULT 'piece',
    "productValue" REAL,
    "isPresale" BOOLEAN NOT NULL DEFAULT false,
    "productType" TEXT NOT NULL DEFAULT 'normal',
    "colorSystem" TEXT,
    "customColorName" TEXT,
    "selectedSizes" TEXT NOT NULL DEFAULT '[]',
    "plugTypes" TEXT NOT NULL DEFAULT '[]',
    "shippingLocations" TEXT NOT NULL DEFAULT '[]',
    "customAttributes" TEXT NOT NULL DEFAULT '[]',
    "wholesaleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "wholesaleMinQuantity" INTEGER,
    "wholesaleDiscount" REAL,
    "selectedRegions" TEXT NOT NULL DEFAULT '[]',
    "regionalPrices" TEXT NOT NULL DEFAULT '{}',
    "priceAdjustMethod" TEXT NOT NULL DEFAULT 'direct',
    "regionalPriceAdjustments" TEXT NOT NULL DEFAULT '{}',
    "shortDesc" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "descriptionLang" TEXT NOT NULL DEFAULT 'English',
    "appTemplateId" TEXT,
    "images" TEXT NOT NULL DEFAULT '[]',
    "mainImage" TEXT,
    "video" TEXT,
    "videoCover" TEXT,
    "weight" REAL,
    "packageSize" TEXT,
    "shippingTemplate" TEXT,
    "serviceTemplate" TEXT,
    "customWeight" BOOLEAN NOT NULL DEFAULT false,
    "priceIncludesTax" TEXT NOT NULL DEFAULT 'include',
    "saleType" TEXT NOT NULL DEFAULT 'normal',
    "inventoryDeduction" TEXT NOT NULL DEFAULT 'payment',
    "alipaySupported" BOOLEAN NOT NULL DEFAULT true,
    "euResponsiblePerson" TEXT,
    "manufacturer" TEXT,
    "sales30d" INTEGER NOT NULL DEFAULT 0,
    "views30d" INTEGER NOT NULL DEFAULT 0,
    "visitors30d" INTEGER NOT NULL DEFAULT 0,
    "conversion30d" REAL NOT NULL DEFAULT 0,
    "paymentAmount30d" REAL NOT NULL DEFAULT 0,
    "payingBuyers30d" INTEGER NOT NULL DEFAULT 0,
    "avgOrderValue30d" REAL NOT NULL DEFAULT 0,
    "chartData" TEXT NOT NULL DEFAULT '[]',
    "visitorsChartData" TEXT NOT NULL DEFAULT '[]',
    "optimizationStatus" TEXT,
    "optimizationTasks" INTEGER NOT NULL DEFAULT 0,
    "optimizationWarnings" TEXT NOT NULL DEFAULT '[]',
    "hasSale" BOOLEAN NOT NULL DEFAULT false,
    "isFlash" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("brand", "categoryId", "comparePrice", "createdAt", "description", "id", "images", "keywords", "mainImage", "model", "packageSize", "price", "shippingTemplate", "shortDesc", "sku", "status", "stock", "title", "updatedAt", "userId", "weight") SELECT "brand", "categoryId", "comparePrice", "createdAt", "description", "id", "images", "keywords", "mainImage", "model", "packageSize", "price", "shippingTemplate", "shortDesc", "sku", "status", "stock", "title", "updatedAt", "userId", "weight" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_userId_idx" ON "Product"("userId");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_deletedAt_idx" ON "Product"("deletedAt");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student',
    "productLimit" INTEGER NOT NULL DEFAULT 3000,
    "draftLimit" INTEGER NOT NULL DEFAULT 500,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt", "username") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProductGroup_userId_idx" ON "ProductGroup"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductGroup_name_userId_key" ON "ProductGroup"("name", "userId");

-- CreateIndex
CREATE INDEX "ProductToGroup_productId_idx" ON "ProductToGroup"("productId");

-- CreateIndex
CREATE INDEX "ProductToGroup_groupId_idx" ON "ProductToGroup"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductToGroup_productId_groupId_key" ON "ProductToGroup"("productId", "groupId");

-- CreateIndex
CREATE INDEX "Media_userId_idx" ON "Media"("userId");

-- CreateIndex
CREATE INDEX "Media_folder_idx" ON "Media"("folder");

-- CreateIndex
CREATE INDEX "Media_type_idx" ON "Media"("type");
