import React from 'react';

const ResponseTable = ({ form, responses }) => {
  if (!form || !responses) return null;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted At
            </th>
            {form.fields.map((field) => (
              <th
                key={field.fieldId}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {responses.length === 0 ? (
            <tr>
              <td colSpan={form.fields.length + 1} className="px-6 py-10 text-center text-gray-500">
                No responses found for this form.
              </td>
            </tr>
          ) : (
            responses.map((response) => (
              <tr key={response._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(response.submittedAt).toLocaleString()}
                </td>
                {form.fields.map((field) => {
                  const answerObj = response.answers.find((a) => a.fieldId === field.fieldId);
                  let displayValue = '';
                  if (answerObj && answerObj.value !== undefined && answerObj.value !== null) {
                    if (Array.isArray(answerObj.value)) {
                      displayValue = answerObj.value.join(', ');
                    } else {
                      displayValue = String(answerObj.value);
                    }
                  }
                  return (
                    <td key={field.fieldId} className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">
                      {displayValue || <span className="text-gray-400 italic">Empty</span>}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResponseTable;
