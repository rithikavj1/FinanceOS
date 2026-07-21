import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json({ error: 'DATABASE_URL environment variable is missing' }, { status: 500 });
  }

  try {
    const { key, data } = await request.json();
    
    const tableMap: Record<string, string> = {
      'fo_transactions': 'transactions',
      'fo_stockItems': 'stock_items',
      'fo_cashBook': 'cash_book_logs',
      'fo_clients': 'clients',
      'fo_invoices': 'invoices',
      'fo_notifications': 'notifications',
      'fo_goals': 'goals',
      'fo_accounts': 'accounts'
    };

    const tableName = tableMap[key];
    if (!tableName) {
      return NextResponse.json({ error: `Invalid sync key: ${key}` }, { status: 400 });
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Payload must be an array of records' }, { status: 400 });
    }

    if (data.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const sql = neon(databaseUrl);

    // Convert camelCase keys to snake_case column names and map rows
    const dbRows = data.map(item => {
      const row: any = {};
      Object.entries(item).forEach(([propName, val]) => {
        const colName = propName.replace(/([A-Z])/g, "_$1").toLowerCase();
        row[colName] = val;
      });
      if (!row.user_id && tableName !== 'stock_items' && tableName !== 'cash_book_logs' && tableName !== 'clients') {
        row.user_id = 'u1';
      }
      return row;
    });

    // Run explicit parameterized queries matching each table schema to satisfy type checking
    switch (tableName) {
      case 'transactions':
        for (const r of dbRows) {
          await sql`
            INSERT INTO transactions (id, user_id, account_id, shared_wallet_id, category_id, amount, type, merchant, description, date, payment_method, need_vs_want, is_recurring, is_business, business_category)
            VALUES (${r.id}, ${r.user_id}, ${r.account_id}, ${r.shared_wallet_id}, ${r.category_id}, ${r.amount}, ${r.type}, ${r.merchant}, ${r.description}, ${r.date}, ${r.payment_method}, ${r.need_vs_want}, ${r.is_recurring}, ${r.is_business}, ${r.business_category})
            ON CONFLICT (id)
            DO UPDATE SET 
              user_id = EXCLUDED.user_id,
              account_id = EXCLUDED.account_id,
              shared_wallet_id = EXCLUDED.shared_wallet_id,
              category_id = EXCLUDED.category_id,
              amount = EXCLUDED.amount,
              type = EXCLUDED.type,
              merchant = EXCLUDED.merchant,
              description = EXCLUDED.description,
              date = EXCLUDED.date,
              payment_method = EXCLUDED.payment_method,
              need_vs_want = EXCLUDED.need_vs_want,
              is_recurring = EXCLUDED.is_recurring,
              is_business = EXCLUDED.is_business,
              business_category = EXCLUDED.business_category
          `;
        }
        break;

      case 'stock_items':
        for (const r of dbRows) {
          await sql`
            INSERT INTO stock_items (id, name, quantity, cost_price, selling_price, low_stock_limit)
            VALUES (${r.id}, ${r.name}, ${r.quantity}, ${r.cost_price}, ${r.selling_price}, ${r.low_stock_limit})
            ON CONFLICT (id)
            DO UPDATE SET
              name = EXCLUDED.name,
              quantity = EXCLUDED.quantity,
              cost_price = EXCLUDED.cost_price,
              selling_price = EXCLUDED.selling_price,
              low_stock_limit = EXCLUDED.low_stock_limit
          `;
        }
        break;

      case 'cash_book_logs':
        for (const r of dbRows) {
          await sql`
            INSERT INTO cash_book_logs (id, date, amount, type, description, payment_method)
            VALUES (${r.id}, ${r.date}, ${r.amount}, ${r.type}, ${r.description}, ${r.payment_method})
            ON CONFLICT (id)
            DO UPDATE SET
              date = EXCLUDED.date,
              amount = EXCLUDED.amount,
              type = EXCLUDED.type,
              description = EXCLUDED.description,
              payment_method = EXCLUDED.payment_method
          `;
        }
        break;

      case 'clients':
        for (const r of dbRows) {
          await sql`
            INSERT INTO clients (id, company_name, contact_person, email, phone, status, outstanding_amount)
            VALUES (${r.id}, ${r.company_name}, ${r.contact_person}, ${r.email}, ${r.phone}, ${r.status}, ${r.outstanding_amount})
            ON CONFLICT (id)
            DO UPDATE SET
              company_name = EXCLUDED.company_name,
              contact_person = EXCLUDED.contact_person,
              email = EXCLUDED.email,
              phone = EXCLUDED.phone,
              status = EXCLUDED.status,
              outstanding_amount = EXCLUDED.outstanding_amount
          `;
        }
        break;

      case 'invoices':
        for (const r of dbRows) {
          await sql`
            INSERT INTO invoices (id, business_account_id, invoice_number, client_name, client_email, client_address, issue_date, due_date, subtotal, gst_rate, gst_amount, total_amount, status, notes)
            VALUES (${r.id}, ${r.business_account_id || 'ba1'}, ${r.invoice_number}, ${r.client_name}, ${r.client_email}, ${r.client_address}, ${r.issue_date}, ${r.due_date}, ${r.subtotal}, ${r.gst_rate}, ${r.gst_amount}, ${r.total_amount}, ${r.status}, ${r.notes})
            ON CONFLICT (id)
            DO UPDATE SET
              client_name = EXCLUDED.client_name,
              client_email = EXCLUDED.client_email,
              client_address = EXCLUDED.client_address,
              issue_date = EXCLUDED.issue_date,
              due_date = EXCLUDED.due_date,
              subtotal = EXCLUDED.subtotal,
              gst_rate = EXCLUDED.gst_rate,
              gst_amount = EXCLUDED.gst_amount,
              total_amount = EXCLUDED.total_amount,
              status = EXCLUDED.status,
              notes = EXCLUDED.notes
          `;
        }
        break;

      case 'notifications':
        for (const r of dbRows) {
          await sql`
            INSERT INTO notifications (id, user_id, title, body, type, is_read)
            VALUES (${r.id}, ${r.user_id}, ${r.title}, ${r.body}, ${r.type}, ${r.is_read})
            ON CONFLICT (id)
            DO UPDATE SET
              title = EXCLUDED.title,
              body = EXCLUDED.body,
              type = EXCLUDED.type,
              is_read = EXCLUDED.is_read
          `;
        }
        break;

      case 'goals':
        for (const r of dbRows) {
          await sql`
            INSERT INTO goals (id, user_id, name, target_amount, current_amount, target_date, category, status)
            VALUES (${r.id}, ${r.user_id}, ${r.name}, ${r.target_amount}, ${r.current_amount}, ${r.target_date}, ${r.category}, ${r.status})
            ON CONFLICT (id)
            DO UPDATE SET
              name = EXCLUDED.name,
              target_amount = EXCLUDED.target_amount,
              current_amount = EXCLUDED.current_amount,
              target_date = EXCLUDED.target_date,
              category = EXCLUDED.category,
              status = EXCLUDED.status
          `;
        }
        break;

      case 'accounts':
        for (const r of dbRows) {
          await sql`
            INSERT INTO accounts (id, user_id, name, type, balance, currency)
            VALUES (${r.id}, ${r.user_id}, ${r.name}, ${r.type}, ${r.balance}, ${r.currency})
            ON CONFLICT (id)
            DO UPDATE SET
              name = EXCLUDED.name,
              type = EXCLUDED.type,
              balance = EXCLUDED.balance,
              currency = EXCLUDED.currency
          `;
        }
        break;
    }

    return NextResponse.json({ success: true, count: data.length });
  } catch (error: any) {
    console.error('Neon SQL sync transaction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
