// Node-only code execution (JavaScript) with a constrained VM sandbox.
// WARNING: For development only. Do not use in production without hardening.
const vm = require('node:vm');

exports.executeCode = async (req, res) => {
    const { code, language, input } = req.body;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ success: false, message: 'Code is required' });
    }

    // Only allow JavaScript for now
    if (!language || !/^js|javascript$/i.test(language)) {
        return res.status(400).json({ success: false, message: 'Only JavaScript execution is supported currently' });
    }

    const start = Date.now();

    try {
        // Create a tightly scoped sandbox
        const sandbox = {
            console: {
                logs: [],
                log: (...args) => sandbox.console.logs.push(args.join(' ')),
                error: (...args) => sandbox.console.logs.push(args.join(' ')),
                warn: (...args) => sandbox.console.logs.push(args.join(' ')),
            },
            input,
        };

        const context = vm.createContext(sandbox, { name: 'psyduck-sandbox' });

        // Wrap code to capture return value
        const wrapped = `
          (async () => {
            ${code}
          })();
        `;

        // Run with timeout and without access to require/process
        const script = new vm.Script(wrapped, { filename: 'user-code.js' });

        // Execute with a micro time slice to mitigate CPU abuse
        const result = await script.runInContext(context, { timeout: 500, displayErrors: true });

        const end = Date.now();
        const stdout = (sandbox.console.logs || []).join('\n');

        return res.status(200).json({
            success: true,
            message: 'Code executed successfully',
            data: {
                id: String(Date.now()),
                success: true,
                output: stdout || (result !== undefined ? String(result) : ''),
                executionTime: end - start,
                memoryUsage: process.memoryUsage().heapUsed,
                status: 'completed',
                errorMessage: null,
            }
        });
    } catch (err) {
        const end = Date.now();
        return res.status(200).json({
            success: false,
            message: 'Code execution failed',
            data: {
                id: String(Date.now()),
                success: false,
                output: '',
                executionTime: end - start,
                memoryUsage: process.memoryUsage().heapUsed,
                status: 'error',
                errorMessage: err && err.message ? String(err.message) : 'Unknown error',
            }
        });
    }
};

