-- DropForeignKey
ALTER TABLE "ShopListItem" DROP CONSTRAINT "ShopListItem_shoplistId_fkey";

-- AddForeignKey
ALTER TABLE "ShopListItem" ADD CONSTRAINT "ShopListItem_shoplistId_fkey" FOREIGN KEY ("shoplistId") REFERENCES "ShopList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
