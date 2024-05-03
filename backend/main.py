from fastapi import FastAPI, Body, Path, Query
from order import order
from user import user
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
# from collections import deque

app = FastAPI()

# deque_obj = deque()

class ExchangeInfo(BaseModel):
    buyer_user_id: int
    seller_user_id: int
    price: float
    quantity: int

class Stock(BaseModel):
    stock_id: int
    stock_ticker: str
    stock_name: str
    stock_price: float

class SavedStock(BaseModel):
    stock_id: int
    saved_stock_price: float
    quantity: int

class PurchasedStock(BaseModel):
    user_id: int
    purchased_stock: List[SavedStock]

class Portfolio(BaseModel):
    user_id: int
    portfolio: List[Stock]
    purchased_stock: PurchasedStock

class User(BaseModel):
    id: int
    name: str
    age: int = Field(..., gte = 18)
    watchlist: Portfolio
    balance: float

class OrderType(str, Enum):
    buy = "buy"
    sell = "sell"

class LimitOrder(BaseModel):
    order_type: OrderType
    price: float
    quantity: int
    user_id: int

class MarketType(str, Enum):
    GoodForDay = "GoodForDay"
    GoodTillCancelled = "GoodTillCancelled"
    GoodTillDate = "GoodTillDate"
    ImmediateOrCancel = "ImmediateOrCancel"
    FillOrKill = "FillOrKill"

class MarketOrder(BaseModel):
    market_type: MarketType
    order_type: OrderType
    price: float
    quantity: int
    user_id: int

class ProcessingOrder(BaseModel):
    price: float
    remaining_quantity: int
    user_id: int

class OrderBook(BaseModel):
    asks: List[ProcessingOrder]
    bids: List[ProcessingOrder]

# /depth :- OrderBook

# /balance :- watchlist, balance

# 

@app.get("/user_info")
async def get_user_information(user: User):
    return user

@app.get("/user/{name}/branch/{branch_id}")
async def get_user_info(
    branch_id: int,
    name: str = Path(min_length = 5, regex = "^[N]|[l]$"),
    brname: str = Query(..., min_length = 5),
    age: Optional[int] = None):

    user = {
        'name': name,
        'branch_id': branch_id,
        'branch_name': brname,
        'age': age
    }

    return user