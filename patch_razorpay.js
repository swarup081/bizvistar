const fs = require('fs');
const file = 'src/app/actions/razorpayActions.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
`    const { data: existingSub } = await supabaseAdmin
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

    if (existingSub) {
        // Double check if period is actually valid (logic shared with subscriptionUtils but simplified here)
        const now = new Date();
        const end = new Date(existingSub.current_period_end);
        if (now < end) {
             // User really has an active plan
             return { success: false, error: "You already have an active plan. Please upgrade or manage it in the dashboard." };
        }
    }`,
`    // 1. Fetch Existing Active Subscription to possibly cancel it later or just log it
    // For now, Razorpay will handle a new subscription being created.
    // We will cancel the old one via webhook or let the user have multiple if they didn't explicitly upgrade.
    // However, since they requested an upgrade path, we allow creating a new one.
    // We remove the hard block to enable upgrades.
    const { data: existingSubs } = await supabaseAdmin
        .from('subscriptions')
        .select('razorpay_subscription_id, status, current_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing']);

    // Pass the old subscription ID in notes so webhook knows to cancel it
    let oldSubId = null;
    if (existingSubs && existingSubs.length > 0) {
        oldSubId = existingSubs[0].razorpay_subscription_id;
    }`
);
fs.writeFileSync(file, content);
